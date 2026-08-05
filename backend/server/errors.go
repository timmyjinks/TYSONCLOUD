package server

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
)

type errorResponse struct {
	Error string `json:"error"`
}

func writeError(w http.ResponseWriter, status int, publicMessage string, internal error) {
	if internal != nil {
		slog.Error(publicMessage, "status", status, "err", internal)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(errorResponse{Error: publicMessage})
}

var emptyName error = errors.New("name was empty")
var emptyImage error = errors.New("image was empty")
var invalidEnv error = errors.New("env was not valid KEY=VALUE lines")
var invalidPort error = errors.New("no port found for engine")

const (
	msgUnauthorized = "Please sign in again."
	msgServerError  = "Something went wrong on our end. Please try again."
	msgBadRequest   = "That request wasn't valid."
)
