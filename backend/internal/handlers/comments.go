package handlers

import (
	"errors"
	"github.com/cvwo-backend/internal/api"
	"github.com/cvwo-backend/internal/auth"
	"github.com/cvwo-backend/internal/dataaccess"
	"github.com/cvwo-backend/internal/models"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func CreateComment(w http.ResponseWriter, r *http.Request) {
	threadID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	var payload struct {
		Body string `json:"body"`
	}

	err = api.ReadJSON(w, r, &payload)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if payload.Body == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "A body is required!")
		return
	}

	if len(payload.Body) > 1000 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Body must be less than 1000 characters!")
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

	newComment := &models.Comment{Body: payload.Body, UserID: int(user.ID), ThreadID: threadID}
	err = data.CreateComment(newComment)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusCreated, nil)
}

func GetComments(w http.ResponseWriter, r *http.Request) {
	comments, err := data.GetAllComments()
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, comments)
}

func GetComment(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	comment, err := data.GetCommentById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, comment)
}

func GetThreadComments(w http.ResponseWriter, r *http.Request) {
	threadID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	comments, err := data.GetCommentsByThreadId(threadID)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, comments)
}

func EditComment(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	var payload struct {
		Body string `json:"body"`
	}

	err = api.ReadJSON(w, r, &payload)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if payload.Body == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "A body is required!")
		return
	}

	if len(payload.Body) > 1000 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Body must be less than 1000 characters!")
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

	comment, err := data.GetCommentById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if comment.UserID != int(user.ID) {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "User is not the owner of this comment!")
		return
	}

	comment.Body = payload.Body

	err = data.EditComment(comment)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusCreated, nil)
}

func DeleteComment(w http.ResponseWriter, r *http.Request) {
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

	comment, err := data.GetCommentById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if comment.UserID != int(user.ID) {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "User is not the owner of this comment!")
		return
	}

	err = data.DeleteCommentById(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, nil)
}
