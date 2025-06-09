package data

import (
	"github.com/soundsphere-backend/internal/database"
	"github.com/soundsphere-backend/internal/models"
)

func CreateVote(vote *models.Vote) error {
	result := database.DB.Table("votes").Create(vote)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetVotesByThreadId(threadID int) ([]*models.Vote, error) {
	var votes []*models.Vote
	result := database.DB.Table("votes").Where("thread_id = ?", threadID).Find(&votes)
	if result.Error != nil {
		return nil, result.Error
	}

	return votes, nil
}

func GetVoteByIds(userID int, threadID int) (*models.Vote, error) {
	var vote models.Vote
	result := database.DB.Table("votes").Where("user_id = ? AND thread_id = ?", userID, threadID).First(&vote)
	if result.Error != nil {
		return nil, result.Error
	}

	return &vote, nil
}

func DeleteVote(vote models.Vote) error {
	result := database.DB.Table("votes").Delete(vote)
	if result.Error != nil {
		return result.Error
	}

	return nil
}
