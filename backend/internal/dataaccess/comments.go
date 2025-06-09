package data

import (
	"github.com/soundsphere-backend/internal/database"
	"github.com/soundsphere-backend/internal/models"
	"gorm.io/gorm/clause"
)

func CreateComment(comment *models.Comment) error {
	result := database.DB.Table("comments").Create(comment)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetAllComments() ([]*models.Comment, error) {
	var comments []*models.Comment
	result := database.DB.Table("comments").Preload(clause.Associations).Find(&comments)
	if result.Error != nil {
		return nil, result.Error
	}

	return comments, nil
}

func GetCommentsByThreadId(threadID int) ([]*models.Comment, error) {
	var comments []*models.Comment
	result := database.DB.Table("comments").Preload(clause.Associations).Where("thread_id = ?", threadID).Order("created_at DESC").Find(&comments)
	if result.Error != nil {
		return nil, result.Error
	}

	return comments, nil
}

func GetCommentById(id int) (*models.Comment, error) {
	var comment models.Comment
	result := database.DB.Table("comments").Preload(clause.Associations).Where("id = ?", id).First(&comment)
	if result.Error != nil {
		return nil, result.Error
	}

	return &comment, nil
}

func EditComment(comment *models.Comment) error {
	result := database.DB.Table("comments").Updates(comment)
	return result.Error
}

func DeleteCommentById(id int) error {
	result := database.DB.Table("comments").Delete(&models.Comment{}, id)
	return result.Error
}
