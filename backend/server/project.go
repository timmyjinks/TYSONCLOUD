package server

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/gorilla/mux"
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

	// Namespace cleanup failing here doesn't change the fact that the
	// project record is gone from the user's perspective — log it for
	// ops to clean up orphaned infra rather than surfacing a confusing
	// "deleted, but also failed" message to the user.
	if err := app.Deploy.DeleteProject(r.Context(), "proj-"+projectId); err != nil {
		slog.Error("failed to clean up project namespace", "project_id", projectId, "err", err)
	}

	w.WriteHeader(204)
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
