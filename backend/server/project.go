package server

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/BurntSushi/toml"
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gorilla/mux"
	"github.com/timmyjinks/tysoncloud/deploy"
	"github.com/timmyjinks/tysoncloud/store"
)

func (app *Application) GetProject(w http.ResponseWriter, r *http.Request) {
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

	project, err := app.Supabase.GetProject(projectId, claims.Subject)
	if err != nil {
		writeError(w, http.StatusNotFound, "We couldn't find that project.", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(ProjectResponse{Id: project.Id, Name: project.Name}); err != nil {
		writeError(w, http.StatusInternalServerError, msgServerError, err)
		return
	}
}

func (app *Application) GetProjects(w http.ResponseWriter, r *http.Request) {
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	projects, err := app.Supabase.GetProjects(claims.Subject)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't load your projects. Please try again.", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(ToProjectsResponse(projects)); err != nil {
		writeError(w, http.StatusInternalServerError, msgServerError, err)
		return
	}
}

func (app *Application) CreateProject(w http.ResponseWriter, r *http.Request) {
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	var project ProjectCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		writeError(w, http.StatusBadRequest, "That project request wasn't valid.", err)
		return
	}

	if project.Name == "" {
		writeError(w, http.StatusBadRequest, "Project name is required.", nil)
		return
	}

	res, err := app.Supabase.CreateProject(claims.Subject, project.Name)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't create the project. Please try again.", err)
		return
	}

	if err := app.Deploy.CreateProject(r.Context(), res.Namespace); err != nil {
		if delErr := app.Supabase.DeleteProject(claims.Subject, res.Id); delErr != nil {
			slog.Error("failed to clean up project after infrastructure setup failed", "project_id", res.Id, "err", delErr)
		}
		writeError(w, http.StatusInternalServerError, "The project was created, but we couldn't finish setting up its infrastructure. Please try again or contact support.", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (app *Application) UpdateProject(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		writeError(w, http.StatusBadRequest, "A project ID is required.", nil)
		return
	}

	var project ProjectUpdateRequest
	if err := json.NewDecoder(r.Body).Decode(&project); err != nil {
		writeError(w, http.StatusBadRequest, "That project request wasn't valid.", err)
		return
	}

	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}

	if project.Name == nil || *project.Name == "" {
		writeError(w, http.StatusBadRequest, "Project name is required.", nil)
		return
	}

	if err := app.Supabase.UpdateProject(projectId, claims.Subject, *project.Name); err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't save the project name. Please try again.", err)
		return
	}
}

func (app *Application) DeleteProject(w http.ResponseWriter, r *http.Request) {
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

	if err := app.Supabase.DeleteProject(claims.Subject, projectId); err != nil {
		writeError(w, http.StatusInternalServerError, "Couldn't delete the project. Please try again.", err)
		return
	}

	if err := app.Deploy.DeleteProject(r.Context(), "proj-"+projectId); err != nil {
		slog.Error("failed to clean up project namespace", "project_id", projectId, "err", err)
	}

	w.WriteHeader(204)
}

func (app *Application) ConfigProject(w http.ResponseWriter, r *http.Request) {
	projectId := mux.Vars(r)["project_id"]
	if projectId == "" {
		writeError(w, http.StatusBadRequest, "A project ID is required.", nil)
		return
	}

	var data ProjectConfigRequest

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		writeError(w, http.StatusBadRequest, "That config request wasn't valid.", err)
		return
	}
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, msgUnauthorized, nil)
		return
	}
	userId := claims.Subject

	var config Config

	if _, err := toml.Decode(data.Content, &config); err != nil {
		writeIssuesError(w, http.StatusBadRequest, "There's a problem with the TOML config.", []Issue{tomlParseIssue(err)}, err)
		return
	}

	if issues := ValidateToml(config); len(issues) > 0 {
		writeIssuesError(w, http.StatusBadRequest, "The config has some problems.", issues, nil)
		return
	}

	rb := newConfigRollback(projectId, userId)
	success := false
	defer func() {
		if !success {
			app.rollbackProjectConfig(rb)
		}
	}()

	for _, service := range config.Services {
		res, err := app.Supabase.CreateService(userId, projectId, service.Name, service.Image, int32(service.Port))
		if err != nil {
			writeError(w, http.StatusInternalServerError, "Couldn't create the service. Please try again.", err)
			return
		}
		rb.serviceTables = append(rb.serviceTables, res)
	}
	serviceTables := rb.serviceTables

	for _, database := range config.Databases {
		port, err := getPort(database.Engine)
		if err != nil {
			writeError(w, http.StatusInternalServerError, err.Error(), err)
			return
		}

		res, err := app.Supabase.CreateDatabase(userId, projectId, database.Name, database.Engine, port, int32(database.StorageGB))
		if err != nil {
			writeError(w, http.StatusInternalServerError, "Couldn't create the service. Please try again.", err)
			return
		}
		rb.databaseTables = append(rb.databaseTables, res)
	}
	databaseTables := rb.databaseTables

	services, databases := ToProjectData(serviceTables, databaseTables)

	for i, service := range services {
		if err := app.Deploy.CreateService(r.Context(), service); err != nil {
			writeError(w, http.StatusInternalServerError, "Couldn't deploy the project's services. Please try again or contact support.", err)
			return
		}
		rb.deployedServices[i] = struct{}{}
	}

	for i, service := range config.Services {
		if service.Volume == nil {
			continue
		}

		if _, err := app.Supabase.CreateVolume(serviceTables[i].Id, userId, service.Volume.MountPath, int32(service.Volume.StorageGB)); err != nil {
			writeError(w, http.StatusInternalServerError, "Couldn't attach the volume. Please try again.", err)
			return
		}
		rb.volumesCreated[i] = struct{}{}

		err := app.Deploy.AttachVolume(r.Context(), deploy.Service{
			Namespace: "proj-" + projectId,
			Name:      serviceTables[i].ResourceName,
		}, deploy.Volume{
			MountPath: service.Volume.MountPath,
			StorageGB: int32(service.Volume.StorageGB),
		})
		if err != nil {
			writeError(w, http.StatusInternalServerError, "The volume record was created, but we couldn't attach it. Please try again or contact support.", err)
			return
		}
		rb.volumesAttached[i] = struct{}{}
	}

	for j, database := range databases {
		if err := app.Deploy.CreateDatabase(r.Context(), database); err != nil {
			writeError(w, http.StatusInternalServerError, "Couldn't provision the project's databases. Please try again or contact support.", err)
			return
		}
		rb.deployedDatabases[j] = struct{}{}
	}

	success = true
	w.WriteHeader(http.StatusCreated)
}

func ToProjectsResponse(projectsTable []store.ProjectsTable) []ProjectResponse {
	var projects []ProjectResponse = []ProjectResponse{}
	for _, project := range projectsTable {
		projects = append(projects, ProjectResponse{
			Id:   project.Id,
			Name: project.Name,
		})
	}
	return projects
}

func ValidateToml(config Config) []Issue {
	var issues []Issue

	for i, service := range config.Services {
		if service.Name == "" {
			issues = append(issues, Issue{Message: fmt.Sprintf("Service #%d is missing a name.", i+1)})
		}
		if service.Name != "" && service.Image == "" {
			issues = append(issues, Issue{Message: fmt.Sprintf("Service %q is missing a Docker image.", service.Name)})
		}
		if service.Name != "" && service.Port < 1 {
			issues = append(issues, Issue{Message: fmt.Sprintf("Service %q has an invalid port (must be 1 or greater).", service.Name)})
		}
	}

	for i, database := range config.Databases {
		if database.Name == "" {
			issues = append(issues, Issue{Message: fmt.Sprintf("Database #%d is missing a name.", i+1)})
		}
		if database.Name != "" && database.Engine == "" {
			issues = append(issues, Issue{Message: fmt.Sprintf("Database %q is missing an engine.", database.Name)})
		}
		if database.Name != "" && database.StorageGB < 0 {
			issues = append(issues, Issue{Message: fmt.Sprintf("Database %q has an invalid storage_gb (must be 0 or greater).", database.Name)})
		}
	}

	return issues
}

var tomlLineRe = regexp.MustCompile(`line (\d+)`)

// tomlParseIssue turns a BurntSushi/toml parse error into an Issue with the
// offending line number where one can be parsed out.
func tomlParseIssue(err error) Issue {
	msg := err.Error()
	msg = strings.TrimPrefix(msg, "toml: ")
	if i := strings.IndexByte(msg, '\n'); i >= 0 {
		msg = msg[:i]
	}

	issue := Issue{Message: msg}
	if m := tomlLineRe.FindStringSubmatch(err.Error()); m != nil {
		if line, parseErr := strconv.Atoi(m[1]); parseErr == nil {
			issue.Line = line
		}
	}
	return issue
}

func ToProjectData(services []store.ServicesTable, databases []store.DatabasesTable) ([]deploy.Service, []deploy.Database) {
	var servicesData []deploy.Service = []deploy.Service{}
	var databasesData []deploy.Database = []deploy.Database{}

	for _, service := range services {
		servicesData = append(servicesData, deploy.Service{
			Namespace: "proj-" + service.ProjectId,
			Name:      service.ResourceName,
			Hostname:  service.PublicDomain,
			Image:     service.Image,
			Port:      int32(service.Port),
			Env:       map[string][]byte{},
		})
	}

	for _, database := range databases {
		databasesData = append(databasesData, deploy.Database{
			Namespace: "proj-" + database.ProjectId,
			Name:      database.ResourceName,
			Engine:    database.Engine,
			StorageGB: int32(database.StorageGB),
		})
	}

	return servicesData, databasesData
}
