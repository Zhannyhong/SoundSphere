package routes

import (
	"github.com/cvwo-backend/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func GetRoutes() func(r chi.Router) {
	return func(r chi.Router) {
		r.Get("/tags", handlers.GetTags)

		r.Post("/threads", handlers.CreateThread)
		r.Get("/threads", handlers.GetThreads)
		r.Get("/threads/{id}", handlers.GetThread)
		r.Patch("/threads/{id}", handlers.EditThread)
		r.Delete("/threads/{id}", handlers.DeleteThread)

		r.Get("/threads/{id}/votes", handlers.GetVotes)
		r.Post("/threads/{id}/votes", handlers.CreateVote)
		r.Delete("/threads/{id}/votes", handlers.DeleteVote)

		r.Post("/threads/{id}/comments", handlers.CreateComment)
		r.Get("/threads/{id}/comments", handlers.GetThreadComments)

		r.Get("/comments", handlers.GetComments)
		r.Get("/comments/{id}", handlers.GetComment)
		r.Patch("/comments/{id}", handlers.EditComment)
		r.Delete("/comments/{id}", handlers.DeleteComment)

		r.Post("/users/signup", handlers.CreateUser)
		r.Post("/users/login", handlers.LoginUser)
		r.Get("/users/refresh", handlers.RefreshUser)
	}
}
