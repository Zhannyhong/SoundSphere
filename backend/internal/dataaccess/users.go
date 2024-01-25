package data

import (
	"github.com/cvwo-backend/internal/database"
	"github.com/cvwo-backend/internal/models"
)

func CreateUser(user *models.User) error {
	result := database.DB.Table("users").Create(user)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetUserById(id int) (*models.User, error) {
	var user models.User
	result := database.DB.Table("users").Where("id = ?", id).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func GetUserByUsername(username string) (*models.User, error) {
	var user models.User
	result := database.DB.Table("users").Where("username = ?", username).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}
