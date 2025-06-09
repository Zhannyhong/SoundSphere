package data

import (
	"github.com/soundsphere-backend/internal/database"
	"github.com/soundsphere-backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func CreateThread(thread *models.Thread) error {
	result := database.DB.Table("threads").Create(thread)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetAllThreads() ([]*models.Thread, error) {
	var threads []*models.Thread
	result := database.DB.Table("threads").Preload(clause.Associations).Order("created_at DESC").Find(&threads)

	if result.Error != nil {
		return nil, result.Error
	}

	return threads, nil
}

func GetThreadById(id int) (*models.Thread, error) {
	var thread models.Thread
	result := database.DB.Table("threads").Preload(clause.Associations).Where("id = ?", id).First(&thread)
	if result.Error != nil {
		return nil, result.Error
	}

	return &thread, nil
}

func EditThread(thread *models.Thread) error {
	result := database.DB.Session(&gorm.Session{FullSaveAssociations: true}).Updates(&thread)
	if result.Error != nil {
		return result.Error
	}

	err := database.DB.Model(&thread).Association("Tags").Replace(&thread.Tags)
	if err != nil {
		return err
	}

	return nil
}

func DeleteThreadById(id int) error {
	result := database.DB.Table("threads").Where("id = ?", id).Delete(&models.Thread{})
	if result.Error != nil {
		return result.Error
	}

	return nil
}
