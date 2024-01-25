package auth

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

type AuthUser struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
}

type Claims struct {
	jwt.RegisteredClaims
	Username string `json:"username"`
}

type JWTs struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

const AccessTokenExpiry = time.Minute * 15
const RefreshTokenExpiry = time.Hour * 24

var SecretKey = os.Getenv("SECRET_KEY")

func GenerateJWTs(user *AuthUser) (JWTs, error) {
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": user.Username,
			"sub":      strconv.Itoa(int(user.ID)),
			"iat":      time.Now().UTC().Unix(),
			"exp":      time.Now().Add(AccessTokenExpiry).Unix(),
		},
	)
	signedAccessToken, err := accessToken.SignedString([]byte(SecretKey))
	if err != nil {
		return JWTs{}, err
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub": strconv.Itoa(int(user.ID)),
			"iat": time.Now().UTC().Unix(),
			"exp": time.Now().UTC().Add(RefreshTokenExpiry).Unix(),
		})
	signedRefreshToken, err := refreshToken.SignedString([]byte(SecretKey))
	if err != nil {
		return JWTs{}, err
	}

	jwts := JWTs{
		AccessToken:  signedAccessToken,
		RefreshToken: signedRefreshToken,
	}

	return jwts, nil
}

func ParseJWT(w http.ResponseWriter, r *http.Request) (*jwt.Token, *Claims, error) {
	authHeader := r.Header.Get("authorization")
	if authHeader == "" {
		return nil, nil, errors.New("Missing authorization header")
	}

	arr := strings.Split(authHeader, " ")
	if len(arr) != 2 || arr[0] != "Bearer" {
		return nil, nil, errors.New("Invalid authorization header")
	}

	tokenString := arr[1]
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, errors.New("Invalid signing method")
		}
		return []byte(SecretKey), nil
	})
	if err != nil {
		return nil, nil, err
	}

	return token, claims, nil
}
