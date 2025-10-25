package repository

import (
	"open-webui-lite/server/internal/model"
	"open-webui-lite/server/pkg/database"

	"gorm.io/gorm"
)

type MessageRepository interface {
	Create(message *model.Message) error
	GetByID(id string) (*model.Message, error)
	GetByConversationID(conversationID string) ([]*model.Message, error)
	GetByConversationIDWithPagination(conversationID string, page, limit int) ([]*model.Message, int64, error)
	Update(message *model.Message) error
	Delete(id string) error
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository() MessageRepository {
	return &messageRepository{
		db: database.GetDB(),
	}
}

func (r *messageRepository) Create(message *model.Message) error {
	return r.db.Create(message).Error
}

func (r *messageRepository) GetByID(id string) (*model.Message, error) {
	var message model.Message
	err := r.db.Where("id = ?", id).First(&message).Error
	if err != nil {
		return nil, err
	}
	return &message, nil
}

func (r *messageRepository) GetByConversationID(conversationID string) ([]*model.Message, error) {
	var messages []*model.Message
	err := r.db.Where("conversation_id = ?", conversationID).Order("created_at ASC").Find(&messages).Error
	return messages, err
}

func (r *messageRepository) GetByConversationIDWithPagination(conversationID string, page, limit int) ([]*model.Message, int64, error) {
	var messages []*model.Message
	var total int64
	
	// Get total count
	err := r.db.Model(&model.Message{}).Where("conversation_id = ?", conversationID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	
	// Get paginated results
	offset := (page - 1) * limit
	err = r.db.Where("conversation_id = ?", conversationID).
		Order("created_at ASC").
		Offset(offset).
		Limit(limit).
		Find(&messages).Error
	
	return messages, total, err
}

func (r *messageRepository) Update(message *model.Message) error {
	return r.db.Save(message).Error
}

func (r *messageRepository) Delete(id string) error {
	return r.db.Delete(&model.Message{}, "id = ?", id).Error
}
