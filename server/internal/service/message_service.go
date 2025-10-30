package service

import (
    "context"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// MessageService encapsulates message-related business logic.
type MessageService interface {
    CreateUserMessage(conversationID, userID string, req dto.SendMessageRequest) (*model.Message, error)
    CreateAssistantMessage(conversationID, userID string, req dto.SendMessageRequest, content string, usage *model.UsageJSONB) (*model.Message, error)
    GenerateAIResponse(ctx context.Context, req dto.SendMessageRequest) (*dto.SendMessageResponse, error)
    GenerateStreamResponse(ctx context.Context, req dto.SendMessageRequest, callback func(dto.StreamDelta)) error
    ListByConversation(conversationID string, page, limit int) ([]*model.Message, int64, error)
}

type messageService struct {
    messageRepo      repository.MessageRepository
    conversationRepo repository.ConversationRepository
    aiService        *MockAIService
}

func NewMessageService(messageRepo repository.MessageRepository, conversationRepo repository.ConversationRepository, ai *MockAIService) MessageService {
    return &messageService{messageRepo: messageRepo, conversationRepo: conversationRepo, aiService: ai}
}

func (s *messageService) CreateUserMessage(conversationID, userID string, req dto.SendMessageRequest) (*model.Message, error) {
    msg := &model.Message{
        ConversationID: conversationID,
        UserID:         userID,
        Role:           req.Role,
        Content:        req.Content,
        Model:          req.Model,
        Temperature:    req.Temperature,
        MaxTokens:      req.MaxTokens,
    }
    if err := s.messageRepo.Create(msg); err != nil {
        return nil, err
    }
    return msg, nil
}

func (s *messageService) CreateAssistantMessage(conversationID, userID string, req dto.SendMessageRequest, content string, usage *model.UsageJSONB) (*model.Message, error) {
    msg := &model.Message{
        ConversationID: conversationID,
        UserID:         userID,
        Role:           "assistant",
        Content:        content,
        Model:          req.Model,
        Temperature:    req.Temperature,
        MaxTokens:      req.MaxTokens,
        Usage:          usage,
    }
    if err := s.messageRepo.Create(msg); err != nil {
        return nil, err
    }
    // update conversation count but do not block result on error
    _ = s.conversationRepo.IncrementMessageCount(conversationID)
    return msg, nil
}

func (s *messageService) GenerateAIResponse(ctx context.Context, req dto.SendMessageRequest) (*dto.SendMessageResponse, error) {
    return s.aiService.GenerateResponse(ctx, req)
}

func (s *messageService) GenerateStreamResponse(ctx context.Context, req dto.SendMessageRequest, callback func(dto.StreamDelta)) error {
    return s.aiService.GenerateStreamResponse(ctx, req, callback)
}

func (s *messageService) ListByConversation(conversationID string, page, limit int) ([]*model.Message, int64, error) {
    return s.messageRepo.GetByConversationIDWithPagination(conversationID, page, limit)
}
