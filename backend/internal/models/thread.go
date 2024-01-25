package models

import "gorm.io/gorm"

type Thread struct {
	gorm.Model
	Title    string    `json:"title" gorm:"size:300;not null"`
	Body     string    `json:"body" gorm:"size:5000"`
	UserID   int       `json:"userID"`
	User     User      `json:"user"`
	Tags     []*Tag    `json:"tags" gorm:"many2many:thread_tags;"`
	Comments []Comment `json:"comments"`
	Votes    []Vote    `json:"votes"`
}
