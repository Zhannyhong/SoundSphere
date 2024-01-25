package data

import (
	"github.com/cvwo-backend/internal/database"
	"github.com/cvwo-backend/internal/models"
)

func GetTagsByNames(names []string) ([]*models.Tag, error) {
	var tags []*models.Tag
	result := database.DB.Table("tags").Where("name IN ?", names).Find(&tags)
	if result.Error != nil {
		return nil, result.Error
	}

	return tags, nil
}

func GetAllTags() ([]string, error) {
	var tags []string
	result := database.DB.Table("tags").Select("name").Find(&tags)
	if result.Error != nil {
		return nil, result.Error
	}

	return tags, nil
}
