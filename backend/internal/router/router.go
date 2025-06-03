package router

import (
    "fmt"
    "strings"
    "os"

	"github.com/cvwo-backend/internal/routes"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func Setup() chi.Router {
	r := chi.NewRouter()

	allowedOrigins := []string{"http://localhost:3000"}

    // Optionally allow frontend URL from env if set, used during production
    if frontend := os.Getenv("FRONTEND_URL"); frontend != "" {
        allowedOrigins = append(allowedOrigins, frontend)
    }
    fmt.Println("CORS allowed origins: " + strings.Join(allowedOrigins, ", "))

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))
	r.Use(middleware.Logger)

	setUpRoutes(r)
	return r
}

func setUpRoutes(r chi.Router) {
	r.Group(routes.GetRoutes())
}
