package service

import (
    "context"
    "time"

    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/model"
    "open-webui-lite/server/internal/repository"
)

// MessageService encapsulates message flow with AI and persistence
type MessageService interface {
    Send(req dto.SendMessageRequest, conversationID, userID string, ai AIResponder) (*dto.SendMessageResponse, error)
    SendStream(req dto.SendMessageRequest, conversationID, userID string, ai AIStreamer, onDelta func(dto.StreamDelta)) (*dto.StreamDone, error)
    List(conversationID, userID string, page, limit int) (*dto.PaginatedMessagesResponse, error)
}

type AIResponder interface {
    GenerateResponse(ctx context.Context, request dto.SendMessageRequest) (*dto.SendMessageResponse, error)
}

type AIStreamer interface {
    GenerateStreamResponse(ctx context.Context, request dto.SendMessageRequest, callback func(dto.StreamDelta)) error
}

type messageService struct {
    messages      repository.MessageRepository
    conversations repository.ConversationRepository
}

func NewMessageService(messages repository.MessageRepository, conversations repository.ConversationRepository) MessageService {
    return &messageService{messages: messages, conversations: conversations}
}

func (s *messageService) Send(req dto.SendMessageRequest, conversationID, userID string, ai AIResponder) (*dto.SendMessageResponse, error) {
    conv, err := s.conversations.GetByID(conversationID)
    if err != nil {
        return nil, ErrNotFound
    }
    if conv.UserID != userID {
        return nil, ErrUnauthorized
    }

    userMessage := &model.Message{
        ConversationID: conversationID,
        UserID:         userID,
        Role:           req.Role,
        Content:        req.Content,
        Model:          req.Model,
        Temperature:    req.Temperature,
        MaxTokens:      req.MaxTokens,
    }
    if err := s.messages.Create(userMessage); err != nil {
        return nil, err
    }

    aiResp, err := ai.GenerateResponse(context.Background(), req)
    if err != nil {
        return nil, err
    }

    assistantMessage := &model.Message{
        ConversationID: conversationID,
        UserID:         userID,
        Role:           "assistant",
        Content:        aiResp.Message.Content,
        Model:          req.Model,
        Temperature:    req.Temperature,
        MaxTokens:      req.MaxTokens,
        Usage: &model.UsageJSONB{
            PromptTokens:     aiResp.Usage.PromptTokens,
            CompletionTokens: aiResp.Usage.CompletionTokens,
            TotalTokens:      aiResp.Usage.TotalTokens,
        },
    }
    if err := s.messages.Create(assistantMessage); err != nil {
        return nil, err
    }
    _ = s.conversations.IncrementMessageCount(conversationID)

    return &dto.SendMessageResponse{
        Message: dto.MessageResponse{
            ID:        assistantMessage.ID,
            Role:      assistantMessage.Role,
            Content:   assistantMessage.Content,
            CreatedAt: assistantMessage.CreatedAt.Format(time.RFC3339),
        },
        Usage: dto.Usage{
            PromptTokens:     aiResp.Usage.PromptTokens,
            CompletionTokens: aiResp.Usage.CompletionTokens,
            TotalTokens:      aiResp.Usage.TotalTokens,
        },
    }, nil
}

func (s *messageService) SendStream(req dto.SendMessageRequest, conversationID, userID string, ai AIStreamer, onDelta func(dto.StreamDelta)) (*dto.StreamDone, error) {
    conv, err := s.conversations.GetByID(conversationID)
    if err != nil {
        return nil, ErrNotFound
    }
    if conv.UserID != userID {
        return nil, ErrUnauthorized
    }

    userMessage := &model.Message{
        ConversationID: conversationID,
        UserID:         userID,
        Role:           req.Role,
        Content:        req.Content,
        Model:          req.Model,
        Temperature:    req.Temperature,
        MaxTokens:      req.MaxTokens,
    }
    if err := s.messages.Create(userMessage); err != nil {
        return nil, err
    }

    var fullContent string
    _ = ai.GenerateStreamResponse(context.Background(), req, func(delta dto.StreamDelta) {
        fullContent += delta.Delta
        onDelta(delta)
    })

    assistantMessage := &model.Message{
        ConversationID: conversationID,
        UserID:         userID,
        Role:           "assistant",
        Content:        fullContent,
        Model:          req.Model,
        Temperature:    req.Temperature,
        MaxTokens:      req.MaxTokens,
        Usage: &model.UsageJSONB{
            PromptTokens:     len(req.Content) / 4,
            CompletionTokens: len(fullContent) / 4,
            TotalTokens:      (len(req.Content) + len(fullContent)) / 4,
        },
    }
    _ = s.messages.Create(assistantMessage)
    _ = s.conversations.IncrementMessageCount(conversationID)

    done := &dto.StreamDone{
        Message: dto.MessageResponse{
            ID:        assistantMessage.ID,
            Role:      assistantMessage.Role,
            Content:   assistantMessage.Content,
            CreatedAt: assistantMessage.CreatedAt.Format(time.RFC3339),
        },
        Usage: dto.Usage{
            PromptTokens:     assistantMessage.Usage.PromptTokens,
            CompletionTokens: assistantMessage.Usage.CompletionTokens,
            TotalTokens:      assistantMessage.Usage.TotalTokens,
        },
    }
    return done, nil
}

func (s *messageService) List(conversationID, userID string, page, limit int) (*dto.PaginatedMessagesResponse, error) {
    conv, err := s.conversations.GetByID(conversationID)
    if err != nil {
        return nil, ErrNotFound
    }
    if conv.UserID != userID {
        return nil, ErrUnauthorized
    }
    messages, total, err := s.messages.GetByConversationIDWithPagination(conversationID, page, limit)
    if err != nil {
        return nil, err
    }

    respMsgs := make([]dto.MessageResponse, 0, len(messages))
    for _, m := range messages {
        respMsgs = append(respMsgs, dto.MessageResponse{ID: m.ID, Role: m.Role, Content: m.Content, CreatedAt: m.CreatedAt.Format(time.RFC3339)})
    }
    totalPages := int((total + int64(limit) - 1) / int64(limit))
    return &dto.PaginatedMessagesResponse{Messages: respMsgs, Total: total, Page: page, Limit: limit, TotalPages: totalPages}, nil
}
