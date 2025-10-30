package service

import (
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// ConversationService encapsulates conversation business logic.
type ConversationService interface {
    Create(userID string, req dto.CreateConversationRequest) (*model.Conversation, error)
    Get(userID, conversationID string) (*model.Conversation, error)
    List(userID, search string, page, limit int) ([]*model.Conversation, int64, error)
    Update(userID string, conversation *model.Conversation, req dto.UpdateConversationRequest) error
    Delete(userID, conversationID string) error
}

type conversationService struct {
    conversationRepo repository.ConversationRepository
}

func NewConversationService(conversationRepo repository.ConversationRepository) ConversationService {
    return &conversationService{conversationRepo: conversationRepo}
}

func (s *conversationService) Create(userID string, req dto.CreateConversationRequest) (*model.Conversation, error) {
    conversation := &model.Conversation{
        UserID:   userID,
        Title:    req.Title,
        Metadata: req.Metadata,
    }
    if err := s.conversationRepo.Create(conversation); err != nil {
        return nil, err
    }
    return conversation, nil
}

func (s *conversationService) Get(userID, conversationID string) (*model.Conversation, error) {
    conversation, err := s.conversationRepo.GetByID(conversationID)
    if err != nil {
        return nil, err
    }
    if conversation.UserID != userID {
        return nil, repository.ErrNotAuthorized
    }
    return conversation, nil
}

func (s *conversationService) List(userID, search string, page, limit int) ([]*model.Conversation, int64, error) {
    if search != "" {
        return s.conversationRepo.SearchByUserID(userID, search, page, limit)
    }
    return s.conversationRepo.GetByUserIDWithPagination(userID, page, limit)
}

func (s *conversationService) Update(userID string, conversation *model.Conversation, req dto.UpdateConversationRequest) error {
    if conversation.UserID != userID {
        return repository.ErrNotAuthorized
    }
    if req.Title != "" {
        conversation.Title = req.Title
    }
    if req.Metadata != nil {
        conversation.Metadata = req.Metadata
    }
    return s.conversationRepo.Update(conversation)
}

func (s *conversationService) Delete(userID, conversationID string) error {
    conversation, err := s.conversationRepo.GetByID(conversationID)
    if err != nil {
        return err
    }
    if conversation.UserID != userID {
        return repository.ErrNotAuthorized
    }
    return s.conversationRepo.Delete(conversationID)
}
