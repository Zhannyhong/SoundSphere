package handlers

import (
	"errors"
	"github.com/soundsphere-backend/internal/api"
	"github.com/soundsphere-backend/internal/auth"
	"github.com/soundsphere-backend/internal/dataaccess"
	"github.com/soundsphere-backend/internal/models"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func CreateThread(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Title string   `json:"title"`
		Body  string   `json:"body"`
		Tags  []string `json:"tags"`
	}

	err := api.ReadJSON(w, r, &payload)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if payload.Title == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "A title is required!")
		return
	}

	if len(payload.Title) > 300 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Title must be less than 300 characters!")
		return
	}

	if len(payload.Body) > 5000 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Body must be less than 5000 characters!")
		return
	}

	if len(payload.Tags) == 0 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "A tag is required!")
		return
	}

	tags, err := data.GetTagsByNames(payload.Tags)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	token, claims, err := auth.ParseJWT(w, r)
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err.Error())
		return
	}
	if !token.Valid {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "Invalid token!")
		return
	}

	user, err := data.GetUserByUsername(claims.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			api.ReturnFailure(w, r, http.StatusUnauthorized, err)
			return
		}

		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	newThread := &models.Thread{Title: payload.Title, Body: payload.Body, UserID: int(user.ID), Tags: tags}
	err = data.CreateThread(newThread)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusCreated, nil)
}

func GetThreads(w http.ResponseWriter, r *http.Request) {
	threads, err := data.GetAllThreads()
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, threads)
}

func GetThread(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	thread, err := data.GetThreadById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, thread)
}

func EditThread(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	var payload struct {
		Title string   `json:"title"`
		Body  string   `json:"body"`
		Tags  []string `json:"tags"`
	}

	err = api.ReadJSON(w, r, &payload)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if payload.Title == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "A title is required!")
		return
	}

	if len(payload.Title) > 300 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Title must be less than 300 characters!")
		return
	}

	if len(payload.Body) > 5000 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Body must be less than 5000 characters!")
		return
	}

	if len(payload.Tags) == 0 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "A tag is required!")
		return
	}

	tags, err := data.GetTagsByNames(payload.Tags)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	token, claims, err := auth.ParseJWT(w, r)
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err.Error())
		return
	}
	if !token.Valid {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "Invalid token!")
		return
	}

	user, err := data.GetUserByUsername(claims.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			api.ReturnFailure(w, r, http.StatusUnauthorized, err)
			return
		}

		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	thread, err := data.GetThreadById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if thread.UserID != int(user.ID) {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "User is not the owner of this thread!")
		return
	}

	thread.Title = payload.Title
	thread.Body = payload.Body
	thread.Tags = tags

	err = data.EditThread(thread)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusCreated, nil)
}

func DeleteThread(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	token, claims, err := auth.ParseJWT(w, r)
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err.Error())
		return
	}
	if !token.Valid {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "Invalid token!")
		return
	}

	user, err := data.GetUserByUsername(claims.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			api.ReturnFailure(w, r, http.StatusUnauthorized, err)
			return
		}

		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	thread, err := data.GetThreadById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if thread.UserID != int(user.ID) {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "User is not the owner of this thread!")
		return
	}

	err = data.DeleteThreadById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, nil)
}
