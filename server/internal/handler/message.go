package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/cloudwego/hertz/pkg/app"
	"open-webui-lite/server/internal/dto"
	"open-webui-lite/server/internal/model"
	"open-webui-lite/server/internal/repository"
	"open-webui-lite/server/internal/service"
)

type MessageHandler struct {
	messageRepo     repository.MessageRepository
	conversationRepo repository.ConversationRepository
	aiService       *service.MockAIService
}

func NewMessageHandler(
	messageRepo repository.MessageRepository,
	conversationRepo repository.ConversationRepository,
	aiService *service.MockAIService,
) *MessageHandler {
	return &MessageHandler{
		messageRepo:     messageRepo,
		conversationRepo: conversationRepo,
		aiService:       aiService,
	}
}

func (h *MessageHandler) SendMessage(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
	// Check if conversation exists and user has access
	conversation, err := h.conversationRepo.GetByID(conversationID)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: "Conversation not found",
			Code:  "NOT_FOUND",
		})
		return
	}

	if conversation.UserID != userID {
		c.JSON(http.StatusForbidden, dto.ErrorResponse{
			Error: "Access denied",
			Code:  "FORBIDDEN",
		})
		return
	}

	var req dto.SendMessageRequest
	if err := c.BindAndValidate(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Invalid request parameters",
			Code:  "VALIDATION_ERROR",
		})
		return
	}

	// Create user message
	userMessage := &model.Message{
		ConversationID: conversationID,
		UserID:         userID,
		Role:           req.Role,
		Content:        req.Content,
		Model:          req.Model,
		Temperature:    req.Temperature,
		MaxTokens:      req.MaxTokens,
	}

	if err := h.messageRepo.Create(userMessage); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to save user message",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Check if streaming is requested
	acceptHeader := string(c.Request.Header.Peek("Accept"))
	if req.Stream && acceptHeader == "text/event-stream" {
		h.handleStreamingResponse(ctx, c, conversationID, userID, req)
		return
	}

	// Generate AI response
	aiResponse, err := h.aiService.GenerateResponse(ctx, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to generate AI response",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Create assistant message
	assistantMessage := &model.Message{
		ConversationID: conversationID,
		UserID:         userID,
		Role:           "assistant",
		Content:        aiResponse.Message.Content,
		Model:          req.Model,
		Temperature:    req.Temperature,
		MaxTokens:      req.MaxTokens,
		Usage: &model.UsageJSONB{
			PromptTokens:     aiResponse.Usage.PromptTokens,
			CompletionTokens: aiResponse.Usage.CompletionTokens,
			TotalTokens:      aiResponse.Usage.TotalTokens,
		},
	}

	if err := h.messageRepo.Create(assistantMessage); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to save assistant message",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Update conversation message count
	h.conversationRepo.IncrementMessageCount(conversationID)

	// Return response
	c.JSON(http.StatusOK, dto.SendMessageResponse{
		Message: dto.MessageResponse{
			ID:        assistantMessage.ID,
			Role:      assistantMessage.Role,
			Content:   assistantMessage.Content,
			CreatedAt: assistantMessage.CreatedAt.Format(time.RFC3339),
		},
		Usage: dto.Usage{
			PromptTokens:     aiResponse.Usage.PromptTokens,
			CompletionTokens: aiResponse.Usage.CompletionTokens,
			TotalTokens:      aiResponse.Usage.TotalTokens,
		},
	})
}

func (h *MessageHandler) handleStreamingResponse(ctx context.Context, c *app.RequestContext, conversationID, userID string, req dto.SendMessageRequest) {
	// Set SSE headers
	c.Response.Header.Set("Content-Type", "text/event-stream")
	c.Response.Header.Set("Cache-Control", "no-cache")
	c.Response.Header.Set("Connection", "keep-alive")
	c.Response.Header.Set("Access-Control-Allow-Origin", "*")

	// Create a channel for streaming
	deltaChan := make(chan dto.StreamDelta, 100)
	
	go func() {
		defer close(deltaChan)
		h.aiService.GenerateStreamResponse(ctx, req, func(delta dto.StreamDelta) {
			deltaChan <- delta
		})
	}()

	var fullContent string
	
	// Stream deltas
	for delta := range deltaChan {
		fullContent += delta.Delta
		
		// Send SSE event
		eventData, _ := json.Marshal(delta)
		fmt.Fprintf(c.Response.BodyWriter(), "event: message.delta\n")
		fmt.Fprintf(c.Response.BodyWriter(), "data: %s\n\n", string(eventData))
		// Flush is not available on io.Writer, but Hertz handles this automatically
	}

	// Create final assistant message
	assistantMessage := &model.Message{
		ConversationID: conversationID,
		UserID:         userID,
		Role:           "assistant",
		Content:        fullContent,
		Model:          req.Model,
		Temperature:    req.Temperature,
		MaxTokens:      req.MaxTokens,
		Usage: &model.UsageJSONB{
			PromptTokens:     len(req.Content) / 4, // Rough estimation
			CompletionTokens: len(fullContent) / 4,
			TotalTokens:      (len(req.Content) + len(fullContent)) / 4,
		},
	}

	if err := h.messageRepo.Create(assistantMessage); err != nil {
		// Log error but don't fail the stream
		fmt.Printf("Failed to save assistant message: %v\n", err)
	}

	// Update conversation message count
	h.conversationRepo.IncrementMessageCount(conversationID)

	// Send final message
	finalMessage := dto.StreamDone{
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

	eventData, _ := json.Marshal(finalMessage)
	fmt.Fprintf(c.Response.BodyWriter(), "event: message.done\n")
	fmt.Fprintf(c.Response.BodyWriter(), "data: %s\n\n", string(eventData))
	// Flush is not available on io.Writer, but Hertz handles this automatically
}

func (h *MessageHandler) GetMessages(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
	// Check if conversation exists and user has access
	conversation, err := h.conversationRepo.GetByID(conversationID)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: "Conversation not found",
			Code:  "NOT_FOUND",
		})
		return
	}

	if conversation.UserID != userID {
		c.JSON(http.StatusForbidden, dto.ErrorResponse{
			Error: "Access denied",
			Code:  "FORBIDDEN",
		})
		return
	}

	// Get messages for this conversation
	messages, err := h.messageRepo.GetByConversationID(conversationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to get messages",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Convert to response format
	var response []dto.MessageResponse
	for _, msg := range messages {
		response = append(response, dto.MessageResponse{
			ID:        msg.ID,
			Role:      msg.Role,
			Content:   msg.Content,
			CreatedAt: msg.CreatedAt.Format(time.RFC3339),
		})
	}

	c.JSON(http.StatusOK, response)
}
