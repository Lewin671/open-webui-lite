package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        string    `json:"id" gorm:"type:uuid;primary_key"`
	Email     string    `json:"email" gorm:"uniqueIndex;not null;size:255"`
	Password  string    `json:"-" gorm:"not null;size:128"`
	Name      string    `json:"name" gorm:"size:100"`
	Avatar    string    `json:"avatar" gorm:"size:500"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}
