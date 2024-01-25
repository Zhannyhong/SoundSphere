package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model
	Body     string `json:"body" gorm:"size:1000;not null"`
	ThreadID int    `json:"threadID"`
	UserID   int    `json:"userID"`
	User     User   `json:"user"`
}
