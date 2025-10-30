package service

import (
    "context"
    "open-webui-lite/server/internal/dto"
)

// AIService abstracts LLM interactions for sync and streaming.
type AIService interface {
    GenerateResponse(ctx context.Context, request dto.SendMessageRequest) (*dto.SendMessageResponse, error)
    GenerateStreamResponse(ctx context.Context, request dto.SendMessageRequest, callback func(dto.StreamDelta)) error
}
