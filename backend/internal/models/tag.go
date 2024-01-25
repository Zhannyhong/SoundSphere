package models

type Tag struct {
	ID      uint      `json:"ID" gorm:"primaryKey;autoIncrement"`
	Name    string    `json:"name" gorm:"not null;unique;"`
	Threads []*Thread `json:"threads" gorm:"many2many:thread_tags;"`
}
