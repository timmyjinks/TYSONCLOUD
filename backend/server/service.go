package server

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkjwt "github.com/clerk/clerk-sdk-go/v2/jwt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/timmyjinks/tysoncloud/deploy"
	"github.com/timmyjinks/tysoncloud/store"
	"github.com/timmyjinks/tysoncloud/util"
)

func (app *Application) GetService(w http.ResponseWriter, r *http.Request) {
	serviceId := mux.Vars(r)["service_id"]
	if serviceId == "" {
		writeError(w, http.StatusBadRequest, "A service ID is required.", nil)
		return
	}

	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	service, err := app.Supabase.GetService(serviceId, claims.Subject)
	if err != nil {
		writeError(w, http.StatusNotFound, "We couldn't find that service.", err)
		return
	}

	env, err := app.Deploy.GetServiceEnv(r.Context(), deploy.Service{
		Namespace: "proj-" + service.ProjectId,
		Name:      service.ResourceName,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't load the service's environment variables.", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(ServiceResponse{
		Id:             service.Id,
		ProjectId:      service.ProjectId,
		Name:           service.Name,
		Image:          service.Image,
		Port:           service.Port,
		Status:         service.Status,
		PublicDomain:   service.PublicDomain,
		InternalDomain: service.PrivateDomain,
		Env:            env,
		CreatedAt:      service.CreatedAt,
	}); err != nil {
		writeError(w, http.StatusInternalServerError, msgServerError, err)
		return
	}
}

func (app *Application) GetServices(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		writeError(w, http.StatusBadRequest, "A project ID is required.", nil)
		return
	}

	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	services, err := app.Supabase.GetServices(projectId, claims.Subject)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't load the project's services. Please try again.", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(ToServicesResponse(services)); err != nil {
		writeError(w, http.StatusInternalServerError, msgServerError, err)
		return
	}
}

func (app *Application) GetServiceLogs(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		writeError(w, http.StatusBadRequest, "A project ID is required.", nil)
		return
	}

	serviceId := mux.Vars(r)["service_id"]
	if serviceId == "" {
		writeError(w, http.StatusBadRequest, "A service ID is required.", nil)
		return
	}

	token := r.URL.Query().Get("token")
	if token == "" {
		cookie, cookieErr := r.Cookie("__session")
		if cookieErr != nil {
			writeError(w, http.StatusUnauthorized, msgUnauthorized, cookieErr)
			return
		}
		token = cookie.Value
	}

	claims, err := clerkjwt.Verify(r.Context(), &clerkjwt.VerifyParams{Token: token})
	if err != nil {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, err)
		return
	}

	service, err := app.Supabase.GetService(serviceId, claims.Subject)
	if err != nil {
		writeError(w, http.StatusNotFound, "We couldn't find that service.", err)
		return
	}

	// A websocket upgrade has already committed the response by the time
	// it can fail, so there's no JSON error body possible past this
	// point — just close the connection.
	allowedOrigins := parseAllowedOrigins(app.Config.Server.AllowedOrigins)
	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			if origin == "" {
				return true
			}
			return allowedOrigins[origin]
		},
	}
	ws, err := upgrader.Upgrade(w, r, http.Header{})
	if err != nil {
		slog.Error("log stream upgrade failed", "err", err)
		return
	}
	defer ws.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	lines := make(chan string)
	go func() {
		defer close(lines)
		if err := app.Deploy.GetServiceLogs(ctx, deploy.Service{
			Namespace: "proj-" + projectId,
			Name:      service.ResourceName,
		}, lines); err != nil {
			slog.Error("log stream failed", "service_id", serviceId, "err", err)
		}
	}()

	for line := range lines {
		if err := ws.WriteJSON(struct {
			Message string `json:"message"`
		}{Message: line}); err != nil {
			break
		}
	}
}

func (app *Application) CreateService(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]

	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	var service ServiceCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&service); err != nil {
		writeError(w, http.StatusBadRequest, "That service request wasn't valid.", err)
		return
	}

	if service.Name == "" {
		writeError(w, http.StatusBadRequest, "Service name is required.", nil)
		return
	}
	if service.Image == "" {
		writeError(w, http.StatusBadRequest, "A Docker image is required.", nil)
		return
	}
	if ok, err := util.ValidateEnv(service.Env); err != nil || !ok {
		writeError(w, http.StatusBadRequest, "Environment variables must be one KEY=value pair per line.", err)
		return
	}

	userId := claims.Subject

	res, err := app.Supabase.CreateService(userId, projectId, service.Name, service.Image, service.Port)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't create the service. Please try again.", err)
		return
	}

	if err := app.Deploy.CreateService(r.Context(), deploy.Service{
		Namespace: "proj-" + projectId,
		Name:      res.ResourceName,
		Hostname:  res.PublicDomain,
		Env:       util.ParseEnv(service.Env),
		Image:     service.Image,
		Port:      service.Port,
	}); err != nil {
		if _, statusErr := app.Supabase.UpdateServiceStatus(res.Id, userId, "failed"); statusErr != nil {
			slog.Error("failed to mark service failed after deploy error", "service_id", res.Id, "err", statusErr)
		}
		writeError(w, http.StatusInternalServerError, "Couldn't deploy the service. Please try again.", err)
		return
	}

	if err := app.Cloudflare.CreateRecord(r.Context(), "tc-"+res.Id); err != nil {
		writeError(w, http.StatusInternalServerError, "The service deployed, but we couldn't set up its domain. Please try again or contact support.", err)
		return
	}

	if err := app.Cloudflare.CreateRoute(r.Context(), "tc-"+res.Id); err != nil {
		writeError(w, http.StatusInternalServerError, "The service deployed, but we couldn't finish routing its domain. Please try again or contact support.", err)
		return
	}

	if _, err := app.Supabase.UpdateServiceStatus(res.Id, userId, "running"); err != nil {
		writeError(w, http.StatusInternalServerError, "The service deployed, but its status couldn't be updated. Refresh to check its current state.", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (app *Application) UpdateService(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		writeError(w, http.StatusBadRequest, "A project ID is required.", nil)
		return
	}

	serviceId := mux.Vars(r)["service_id"]
	if serviceId == "" {
		writeError(w, http.StatusBadRequest, "A service ID is required.", nil)
		return
	}

	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	var service ServiceUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&service); err != nil {
		writeError(w, http.StatusBadRequest, "That service request wasn't valid.", err)
		return
	}

	var env string
	if service.Env != nil {
		if ok, err := util.ValidateEnv(*service.Env); err != nil || !ok {
			writeError(w, http.StatusBadRequest, "Environment variables must be one KEY=value pair per line.", err)
			return
		}
		env = *service.Env
	}

	if service.Name == nil || *service.Name == "" {
		writeError(w, http.StatusBadRequest, "Service name is required.", nil)
		return
	}
	if service.Image == nil || *service.Image == "" {
		writeError(w, http.StatusBadRequest, "A Docker image is required.", nil)
		return
	}
	if service.Port == nil {
		writeError(w, http.StatusBadRequest, "A port is required.", nil)
		return
	}

	userId := claims.Subject

	res, err := app.Supabase.UpdateService(serviceId, userId, *service.Name, *service.Image, *service.Port)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't save the service. Please try again.", err)
		return
	}

	if err := app.Deploy.CreateService(r.Context(), deploy.Service{
		Namespace: "proj-" + projectId,
		Name:      res.ResourceName,
		Hostname:  res.PublicDomain,
		Env:       util.ParseEnv(env),
		Image:     *service.Image,
		Port:      *service.Port,
	}); err != nil {
		if _, statusErr := app.Supabase.UpdateServiceStatus(res.Id, userId, "failed"); statusErr != nil {
			slog.Error("failed to mark service failed after deploy error", "service_id", res.Id, "err", statusErr)
		}
		writeError(w, http.StatusInternalServerError, "Couldn't redeploy the service with your changes. Please try again.", err)
		return
	}

	if _, err := app.Supabase.UpdateServiceStatus(res.Id, userId, "running"); err != nil {
		writeError(w, http.StatusInternalServerError, "The service redeployed, but its status couldn't be updated. Refresh to check its current state.", err)
		return
	}
}

func (app *Application) DeleteService(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		writeError(w, http.StatusBadRequest, "A project ID is required.", nil)
		return
	}

	serviceId := mux.Vars(r)["service_id"]
	if serviceId == "" {
		writeError(w, http.StatusBadRequest, "A service ID is required.", nil)
		return
	}

	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	if err := app.Supabase.DeleteService(serviceId, claims.Subject); err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't delete the service. Please try again.", err)
		return
	}

	// The DB record is gone at this point regardless of what happens
	// below — log infra cleanup failures for ops rather than blocking
	// or confusing the user with a partial-failure response. (Previously
	// this branch returned with NO response written at all on a k8s
	// error, silently leaving the request hanging as an empty 200.)
	if err := app.Deploy.DeleteService(r.Context(), deploy.Service{
		Namespace: "proj-" + projectId,
		Name:      "svc-" + serviceId,
	}); err != nil {
		slog.Error("failed to clean up service infrastructure", "service_id", serviceId, "err", err)
	}

	if err := app.Cloudflare.DeleteRecord(r.Context(), "tc-"+serviceId); err != nil {
		slog.Error("failed to clean up service DNS record", "service_id", serviceId, "err", err)
	}

	if err := app.Cloudflare.DeleteRoute(r.Context(), "tc-"+serviceId); err != nil {
		slog.Error("failed to clean up service route", "service_id", serviceId, "err", err)
	}

	w.WriteHeader(204)
}

func ToServicesResponse(servicesTable []store.ServicesTable) []ServiceResponse {
	var services []ServiceResponse = []ServiceResponse{}
	for _, service := range servicesTable {
		services = append(services, ServiceResponse{
			Id:             service.Id,
			ProjectId:      service.ProjectId,
			Name:           service.Name,
			Image:          service.Image,
			Port:           service.Port,
			Status:         service.Status,
			PublicDomain:   service.PublicDomain,
			InternalDomain: service.PrivateDomain,
			CreatedAt:      service.CreatedAt,
		})
	}
	return services
}
