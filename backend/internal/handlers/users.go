package handlers

import (
	"errors"
	"github.com/soundsphere-backend/internal/api"
	"github.com/soundsphere-backend/internal/auth"
	"github.com/soundsphere-backend/internal/dataaccess"
	"github.com/soundsphere-backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type authInfo struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	Username     string `json:"username"`
	UserID       uint   `json:"userID"`
}

func RefreshUser(w http.ResponseWriter, r *http.Request) {
	token, claims, err := auth.ParseJWT(w, r)
	if err != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, err.Error())
		return
	}
	if !token.Valid {
		api.ReturnFailure(w, r, http.StatusUnauthorized, "Invalid token!")
		return
	}

	userID, _ := strconv.Atoi(claims.Subject)
	user, err := data.GetUserById(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			api.ReturnFailure(w, r, http.StatusUnauthorized, err)
			return
		}

		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	authUser := auth.AuthUser{
		ID:       user.ID,
		Username: user.Username,
	}

	jwts, err := auth.GenerateJWTs(&authUser)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	authPayload := authInfo{AccessToken: jwts.AccessToken, RefreshToken: jwts.RefreshToken, Username: user.Username, UserID: user.ID}
	api.ReturnPayload(w, r, http.StatusOK, authPayload)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := api.ReadJSON(w, r, &payload)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if payload.Username == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Invalid username!")
		return
	}

	if len(payload.Username) > 20 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Username must be less than 20 characters!")
		return
	}

	if payload.Password == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Invalid password!")
		return
	}

	if len(payload.Password) > 50 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Password must be less than 50 characters!")
		return
	}

	user, err := data.GetUserByUsername(payload.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			api.ReturnFailure(w, r, http.StatusBadRequest, "Username not found!")
			return
		}
		api.ReturnError(w, r, http.StatusInternalServerError, err)
	}

	result := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if result != nil {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Incorrect password!")
		return
	}

	authUser := auth.AuthUser{
		ID:       user.ID,
		Username: user.Username,
	}

	jwts, err := auth.GenerateJWTs(&authUser)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	authPayload := authInfo{AccessToken: jwts.AccessToken, RefreshToken: jwts.RefreshToken, Username: user.Username, UserID: user.ID}
	api.ReturnPayload(w, r, http.StatusOK, authPayload)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := api.ReadJSON(w, r, &payload)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	if payload.Username == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Invalid username!")
		return
	}

	if len(payload.Username) > 20 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Username must be less than 20 characters!")
		return
	}

	if payload.Password == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Invalid password!")
		return
	}

	if len(payload.Password) > 36 {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Password must be less than 36 characters!")
		return
	}

	_, err = data.GetUserByUsername(payload.Username)
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Username already exists!")
		return
	}

	if payload.Password == "" {
		api.ReturnFailure(w, r, http.StatusBadRequest, "Invalid password!")
		return
	}

	hashedPw, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	newUser := &models.User{Username: payload.Username, Password: string(hashedPw)}
	err = data.CreateUser(newUser)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	authUser := auth.AuthUser{
		ID:       newUser.ID,
		Username: newUser.Username,
	}

	jwts, err := auth.GenerateJWTs(&authUser)
	if err != nil {
		api.ReturnError(w, r, http.StatusInternalServerError, err)
		return
	}

	authPayload := authInfo{AccessToken: jwts.AccessToken, RefreshToken: jwts.RefreshToken, Username: newUser.Username, UserID: newUser.ID}
	api.ReturnPayload(w, r, http.StatusCreated, authPayload)
}
