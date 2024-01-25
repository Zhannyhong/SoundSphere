package models

import "time"

type Vote struct {
	ThreadID  int       `json:"threadID" gorm:"primaryKey"`
	UserID    int       `json:"userID" gorm:"primaryKey"`
	Vote      int       `json:"vote"`
	CreatedAt time.Time `json:"CreatedAt"`
}
