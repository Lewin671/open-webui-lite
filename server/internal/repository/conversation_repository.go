package repository

import (
	"open-webui-lite/server/internal/model"
	"open-webui-lite/server/pkg/database"

	"gorm.io/gorm"
)

type ConversationRepository interface {
	Create(conversation *model.Conversation) error
	GetByID(id string) (*model.Conversation, error)
	GetByUserID(userID string) ([]*model.Conversation, error)
	Update(conversation *model.Conversation) error
	Delete(id string) error
	IncrementMessageCount(id string) error
}

type conversationRepository struct {
	db *gorm.DB
}

func NewConversationRepository() ConversationRepository {
	return &conversationRepository{
		db: database.GetDB(),
	}
}

func (r *conversationRepository) Create(conversation *model.Conversation) error {
	return r.db.Create(conversation).Error
}

func (r *conversationRepository) GetByID(id string) (*model.Conversation, error) {
	var conversation model.Conversation
	err := r.db.Where("id = ?", id).First(&conversation).Error
	if err != nil {
		return nil, err
	}
	return &conversation, nil
}

func (r *conversationRepository) GetByUserID(userID string) ([]*model.Conversation, error) {
	var conversations []*model.Conversation
	err := r.db.Where("user_id = ?", userID).Order("updated_at DESC").Find(&conversations).Error
	return conversations, err
}

func (r *conversationRepository) Update(conversation *model.Conversation) error {
	return r.db.Save(conversation).Error
}

func (r *conversationRepository) Delete(id string) error {
	return r.db.Delete(&model.Conversation{}, "id = ?", id).Error
}

func (r *conversationRepository) IncrementMessageCount(id string) error {
	return r.db.Model(&model.Conversation{}).Where("id = ?", id).Update("message_count", gorm.Expr("message_count + 1")).Error
}
