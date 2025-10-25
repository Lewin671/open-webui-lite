package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Message struct {
	ID             string    `json:"id" gorm:"type:uuid;primary_key"`
	ConversationID string    `json:"conversationId" gorm:"type:uuid;not null;index"`
	UserID         string    `json:"userId" gorm:"type:uuid;not null;index"`
	Role           string    `json:"role" gorm:"not null"` // "user" or "assistant"
	Content        string    `json:"content" gorm:"type:text;not null"`
	Model          string    `json:"model,omitempty"`
	Temperature    float64   `json:"temperature,omitempty"`
	MaxTokens      int       `json:"maxTokens,omitempty"`
	Usage          *Usage    `json:"usage,omitempty" gorm:"type:jsonb"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
	
	// Relations
	Conversation Conversation `json:"conversation,omitempty" gorm:"foreignKey:ConversationID"`
	User         User         `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type Usage struct {
	PromptTokens     int `json:"promptTokens"`
	CompletionTokens int `json:"completionTokens"`
	TotalTokens      int `json:"totalTokens"`
}

func (m *Message) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return nil
}
