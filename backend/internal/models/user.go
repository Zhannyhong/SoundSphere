package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string    `json:"username" gorm:"size:20;not null;unique"`
	Password string    `json:"-" gorm:"size:60;not null"`
	Threads  []Thread  `json:"threads"`
	Comments []Comment `json:"comments"`
	Votes    []Vote    `json:"votes"`
}
