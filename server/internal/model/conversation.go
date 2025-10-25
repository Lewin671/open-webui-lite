package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Conversation struct {
	ID           string                 `json:"id" gorm:"type:uuid;primary_key"`
	UserID       string                 `json:"userId" gorm:"type:uuid;not null;index"`
	Title        string                 `json:"title"`
	MessageCount int                    `json:"messageCount" gorm:"default:0"`
	Metadata     map[string]interface{} `json:"metadata" gorm:"type:jsonb"`
	CreatedAt    time.Time              `json:"createdAt"`
	UpdatedAt    time.Time              `json:"updatedAt"`
	
	// Relations
	User     User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Messages []Message `json:"messages,omitempty" gorm:"foreignKey:ConversationID"`
}

func (c *Conversation) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return nil
}
