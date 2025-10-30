package service

import (
    "context"
    "open-webui-lite/server/internal/dto"
)

// AIService defines the interface for generating AI responses.
// This allows swapping mock and real providers without changing handlers.
type AIService interface {
    GenerateResponse(ctx context.Context, request dto.SendMessageRequest) (*dto.SendMessageResponse, error)
    GenerateStreamResponse(ctx context.Context, request dto.SendMessageRequest, callback func(dto.StreamDelta)) error
}
