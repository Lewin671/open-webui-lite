package model

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Conversation struct {
	ID           string                 `json:"id" gorm:"type:uuid;primary_key"`
	UserID       string                 `json:"userId" gorm:"type:uuid;not null;index"`
	Title        string                 `json:"title" gorm:"size:200;not null"`
	MessageCount int                    `json:"messageCount" gorm:"default:0"`
	Metadata     JSONB `json:"metadata" gorm:"type:jsonb"`
	CreatedAt    time.Time              `json:"createdAt"`
	UpdatedAt    time.Time              `json:"updatedAt"`
	
	// Relations
	User     User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Messages []Message `json:"messages,omitempty" gorm:"foreignKey:ConversationID"`
}

// JSONB type for PostgreSQL JSONB fields
type JSONB map[string]interface{}

// Value implements driver.Valuer interface
func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements sql.Scanner interface
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return nil
	}
	
	return json.Unmarshal(bytes, j)
}

func (c *Conversation) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	return nil
}
