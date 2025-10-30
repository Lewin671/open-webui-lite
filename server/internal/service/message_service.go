package service

import (
    "context"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// MessageService manages message flows with AI and persistence.
type MessageService interface {
    Send(ctx context.Context, userID string, conversationID string, req dto.SendMessageRequest) (*model.Message, dto.Usage, error)
    SendStream(ctx context.Context, userID string, conversationID string, req dto.SendMessageRequest, onDelta func(dto.StreamDelta)) (*model.Message, dto.Usage, error)
    List(userID string, conversationID string, page, limit int) ([]*model.Message, int64, error)
}

type messageService struct {
    messages      repository.MessageRepository
    conversations repository.ConversationRepository
    ai            AIService
}

func NewMessageService(messages repository.MessageRepository, conversations repository.ConversationRepository, ai AIService) MessageService {
    return &messageService{messages: messages, conversations: conversations, ai: ai}
}

func (s *messageService) ensureOwnership(userID, conversationID string) (*model.Conversation, error) {
    conv, err := s.conversations.GetByID(conversationID)
    if err != nil { return nil, err }
    if conv.UserID != userID { return nil, ErrForbidden }
    return conv, nil
}

func (s *messageService) Send(ctx context.Context, userID string, conversationID string, req dto.SendMessageRequest) (*model.Message, dto.Usage, error) {
    if _, err := s.ensureOwnership(userID, conversationID); err != nil { return nil, dto.Usage{}, err }

    userMsg := &model.Message{ConversationID: conversationID, UserID: userID, Role: req.Role, Content: req.Content, Model: req.Model, Temperature: req.Temperature, MaxTokens: req.MaxTokens}
    if err := s.messages.Create(userMsg); err != nil { return nil, dto.Usage{}, err }

    aiResp, err := s.ai.GenerateResponse(ctx, req)
    if err != nil { return nil, dto.Usage{}, err }

    assistant := &model.Message{ConversationID: conversationID, UserID: userID, Role: "assistant", Content: aiResp.Message.Content, Model: req.Model, Temperature: req.Temperature, MaxTokens: req.MaxTokens, Usage: &model.UsageJSONB{PromptTokens: aiResp.Usage.PromptTokens, CompletionTokens: aiResp.Usage.CompletionTokens, TotalTokens: aiResp.Usage.TotalTokens}}
    if err := s.messages.Create(assistant); err != nil { return nil, dto.Usage{}, err }
    _ = s.conversations.IncrementMessageCount(conversationID)

    return assistant, aiResp.Usage, nil
}

func (s *messageService) SendStream(ctx context.Context, userID string, conversationID string, req dto.SendMessageRequest, onDelta func(dto.StreamDelta)) (*model.Message, dto.Usage, error) {
    if _, err := s.ensureOwnership(userID, conversationID); err != nil { return nil, dto.Usage{}, err }

    userMsg := &model.Message{ConversationID: conversationID, UserID: userID, Role: req.Role, Content: req.Content, Model: req.Model, Temperature: req.Temperature, MaxTokens: req.MaxTokens}
    if err := s.messages.Create(userMsg); err != nil { return nil, dto.Usage{}, err }

    var full string
    _ = s.ai.GenerateStreamResponse(ctx, req, func(delta dto.StreamDelta){
        full += delta.Delta
        onDelta(delta)
    })

    assistant := &model.Message{ConversationID: conversationID, UserID: userID, Role: "assistant", Content: full, Model: req.Model, Temperature: req.Temperature, MaxTokens: req.MaxTokens, Usage: &model.UsageJSONB{PromptTokens: len(req.Content)/4, CompletionTokens: len(full)/4, TotalTokens: (len(req.Content)+len(full))/4}}
    if err := s.messages.Create(assistant); err != nil { return nil, dto.Usage{}, err }
    _ = s.conversations.IncrementMessageCount(conversationID)

    return assistant, dto.Usage{PromptTokens: assistant.Usage.PromptTokens, CompletionTokens: assistant.Usage.CompletionTokens, TotalTokens: assistant.Usage.TotalTokens}, nil
}

func (s *messageService) List(userID string, conversationID string, page, limit int) ([]*model.Message, int64, error) {
    if _, err := s.ensureOwnership(userID, conversationID); err != nil { return nil, 0, err }
    return s.messages.GetByConversationIDWithPagination(conversationID, page, limit)
}
