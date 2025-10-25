package model

import (
	"database/sql/driver"
	"encoding/json"
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
	Usage          *UsageJSONB `json:"usage,omitempty" gorm:"type:jsonb"`
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

// UsageJSONB type for PostgreSQL JSONB fields
type UsageJSONB Usage

// Value implements driver.Valuer interface
func (u UsageJSONB) Value() (driver.Value, error) {
	return json.Marshal(u)
}

// Scan implements sql.Scanner interface
func (u *UsageJSONB) Scan(value interface{}) error {
	if value == nil {
		*u = UsageJSONB{}
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	
	return json.Unmarshal(bytes, u)
}

func (m *Message) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return nil
}
