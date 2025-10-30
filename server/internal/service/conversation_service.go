package service

import (
    "errors"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// ConversationService encapsulates conversation business logic.
type ConversationService interface {
    Create(userID string, req dto.CreateConversationRequest) (*model.Conversation, error)
    List(userID string, page, limit int, search string) ([]*model.Conversation, int64, error)
    Get(userID string, id string) (*model.Conversation, error)
    Update(userID string, id string, req dto.UpdateConversationRequest) (*model.Conversation, error)
    Delete(userID string, id string) error
}

type conversationService struct {
    conversations repository.ConversationRepository
}

func NewConversationService(conversations repository.ConversationRepository) ConversationService {
    return &conversationService{conversations: conversations}
}

func (s *conversationService) Create(userID string, req dto.CreateConversationRequest) (*model.Conversation, error) {
    c := &model.Conversation{UserID: userID, Title: req.Title, Metadata: req.Metadata}
    if err := s.conversations.Create(c); err != nil { return nil, err }
    return c, nil
}

func (s *conversationService) List(userID string, page, limit int, search string) ([]*model.Conversation, int64, error) {
    if search != "" {
        return s.conversations.SearchByUserID(userID, search, page, limit)
    }
    return s.conversations.GetByUserIDWithPagination(userID, page, limit)
}

func (s *conversationService) Get(userID string, id string) (*model.Conversation, error) {
    conv, err := s.conversations.GetByID(id)
    if err != nil { return nil, err }
    if conv.UserID != userID { return nil, ErrForbidden }
    return conv, nil
}

func (s *conversationService) Update(userID string, id string, req dto.UpdateConversationRequest) (*model.Conversation, error) {
    conv, err := s.conversations.GetByID(id)
    if err != nil { return nil, err }
    if conv.UserID != userID { return nil, ErrForbidden }
    if req.Title != "" { conv.Title = req.Title }
    if req.Metadata != nil { conv.Metadata = req.Metadata }
    if err := s.conversations.Update(conv); err != nil { return nil, err }
    return conv, nil
}

func (s *conversationService) Delete(userID string, id string) error {
    conv, err := s.conversations.GetByID(id)
    if err != nil { return err }
    if conv.UserID != userID { return ErrForbidden }
    return s.conversations.Delete(id)
}

var _ = errors.New // keep import used
