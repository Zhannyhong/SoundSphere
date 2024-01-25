package main

import (
	"fmt"
	"github.com/cvwo-backend/internal/models"
	"log"
	"net/http"
	"os"

	"github.com/cvwo-backend/internal/database"
	"github.com/cvwo-backend/internal/router"
)

func main() {
	r := router.Setup()

	_, err := database.ConnectToDB()
	if err != nil {
		log.Fatalln(err)
	}

	database.DB.AutoMigrate(&models.Tag{}, &models.User{}, &models.Comment{}, &models.Thread{}, &models.Vote{})
	database.DB.Table("tags").Create([]*models.Tag{
		{Name: "blues"},
		{Name: "classical"},
		{Name: "country"},
		{Name: "electronic"},
		{Name: "folk"},
		{Name: "hip-hop"},
		{Name: "jazz"},
		{Name: "reggae"},
		{Name: "pop"},
		{Name: "rock"},
		{Name: "r&b"},
		{Name: "rap"},
		{Name: "metal"},
		{Name: "indie"}},
	)

	fmt.Print("Listening on " + os.Getenv("REACT_APP_SERVER_URL") + "!\n")
	log.Fatalln(http.ListenAndServe(":"+os.Getenv("BACKEND_PORT"), r))
}
