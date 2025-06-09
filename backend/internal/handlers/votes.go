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

func CreateVote(w http.ResponseWriter, r *http.Request) {
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

	// Check if user has already voted on this thread
	_, err = data.GetVoteByIds(int(user.ID), id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			newVote := &models.Vote{ThreadID: id, UserID: int(user.ID), Vote: 1}
			err = data.CreateVote(newVote)
			if err != nil {
				api.ReturnError(w, r, http.StatusInternalServerError, err)
				return
			}

			api.ReturnPayload(w, r, http.StatusOK, nil)
			return
		} else {
			api.ReturnError(w, r, http.StatusInternalServerError, err)
			return
		}
	}

	api.ReturnFailure(w, r, http.StatusBadRequest, "User has already voted on this thread!")
	return
}

func GetVotes(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err)
		return
	}

	votes, err := data.GetVotesByThreadId(id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, votes)
}

func DeleteVote(w http.ResponseWriter, r *http.Request) {
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

	// Check if user has already voted on this thread
	vote, err := data.GetVoteByIds(int(user.ID), id)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}
	if vote == nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, "User has not voted on this thread!")
		return
	}

	err = data.DeleteVote(*vote)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	api.ReturnPayload(w, r, http.StatusOK, nil)
}
