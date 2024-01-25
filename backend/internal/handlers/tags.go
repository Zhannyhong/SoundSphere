package handlers

import (
	"github.com/cvwo-backend/internal/api"
	"net/http"

	"github.com/cvwo-backend/internal/dataaccess"
)

func GetTags(w http.ResponseWriter, r *http.Request) {
	tags, err := data.GetAllTags()
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, tags)
}
