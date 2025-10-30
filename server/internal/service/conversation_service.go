package service

import (
    "time"

    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// ConversationService encapsulates conversation business logic
type ConversationService interface {
    Create(userID string, req dto.CreateConversationRequest) (*dto.ConversationResponse, error)
    Get(userID, id string) (*dto.ConversationResponse, error)
    List(userID string, page, limit int, search string) (*dto.PaginatedConversationsResponse, error)
    Update(userID, id string, req dto.UpdateConversationRequest) (*dto.ConversationResponse, error)
    Delete(userID, id string) error
}

type conversationService struct {
    conversations repository.ConversationRepository
}

func NewConversationService(conversations repository.ConversationRepository) ConversationService {
    return &conversationService{conversations: conversations}
}

func (s *conversationService) Create(userID string, req dto.CreateConversationRequest) (*dto.ConversationResponse, error) {
    conversation := &model.Conversation{UserID: userID, Title: req.Title, Metadata: req.Metadata}
    if err := s.conversations.Create(conversation); err != nil {
        return nil, err
    }
    return toConversationResponse(conversation), nil
}

func (s *conversationService) Get(userID, id string) (*dto.ConversationResponse, error) {
    conv, err := s.conversations.GetByID(id)
    if err != nil {
        return nil, ErrNotFound
    }
    if conv.UserID != userID {
        return nil, ErrUnauthorized
    }
    return toConversationResponse(conv), nil
}

func (s *conversationService) List(userID string, page, limit int, search string) (*dto.PaginatedConversationsResponse, error) {
    var (
        conversations []*model.Conversation
        total         int64
        err           error
    )
    if search != "" {
        conversations, total, err = s.conversations.SearchByUserID(userID, search, page, limit)
    } else {
        conversations, total, err = s.conversations.GetByUserIDWithPagination(userID, page, limit)
    }
    if err != nil {
        return nil, err
    }

    respItems := make([]dto.ConversationResponse, 0, len(conversations))
    for _, conv := range conversations {
        respItems = append(respItems, *toConversationResponse(conv))
    }
    totalPages := int((total + int64(limit) - 1) / int64(limit))
    return &dto.PaginatedConversationsResponse{Conversations: respItems, Total: total, Page: page, Limit: limit, TotalPages: totalPages}, nil
}

func (s *conversationService) Update(userID, id string, req dto.UpdateConversationRequest) (*dto.ConversationResponse, error) {
    conv, err := s.conversations.GetByID(id)
    if err != nil {
        return nil, ErrNotFound
    }
    if conv.UserID != userID {
        return nil, ErrUnauthorized
    }
    if req.Title != "" {
        conv.Title = req.Title
    }
    if req.Metadata != nil {
        conv.Metadata = req.Metadata
    }
    if err := s.conversations.Update(conv); err != nil {
        return nil, err
    }
    return toConversationResponse(conv), nil
}

func (s *conversationService) Delete(userID, id string) error {
    conv, err := s.conversations.GetByID(id)
    if err != nil {
        return ErrNotFound
    }
    if conv.UserID != userID {
        return ErrUnauthorized
    }
    return s.conversations.Delete(id)
}

func toConversationResponse(conv *model.Conversation) *dto.ConversationResponse {
    return &dto.ConversationResponse{
        ID:           conv.ID,
        Title:        conv.Title,
        CreatedAt:    conv.CreatedAt.Format(time.RFC3339),
        UpdatedAt:    conv.UpdatedAt.Format(time.RFC3339),
        MessageCount: conv.MessageCount,
        Metadata:     conv.Metadata,
    }
}
