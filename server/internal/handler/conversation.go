package handler

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/cloudwego/hertz/pkg/app"
	"open-webui-lite/server/internal/dto"
	"open-webui-lite/server/internal/middleware"
	"open-webui-lite/server/internal/model"
	"open-webui-lite/server/internal/repository"
)

type ConversationHandler struct {
	conversationRepo repository.ConversationRepository
}

func NewConversationHandler(conversationRepo repository.ConversationRepository) *ConversationHandler {
	return &ConversationHandler{
		conversationRepo: conversationRepo,
	}
}

func (h *ConversationHandler) CreateConversation(ctx context.Context, c *app.RequestContext) {
	var req dto.CreateConversationRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse{
			Error: "Invalid JSON format",
			Code:  "INVALID_JSON",
		})
		return
	}

	// 使用自定义校验获取详细错误信息
	validationErrors := middleware.ValidateStruct(&req)
	if len(validationErrors) > 0 {
		middleware.ValidationErrorResponse(c, validationErrors)
		return
	}

	userID := c.GetString("user_id")
	
	conversation := &model.Conversation{
		UserID:   userID,
		Title:    req.Title,
		Metadata: req.Metadata,
	}

	if err := h.conversationRepo.Create(conversation); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to create conversation",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	c.JSON(http.StatusCreated, dto.ConversationResponse{
		ID:        conversation.ID,
		Title:     conversation.Title,
		CreatedAt: conversation.CreatedAt.Format(time.RFC3339),
		UpdatedAt: conversation.UpdatedAt.Format(time.RFC3339),
		Metadata:  conversation.Metadata,
	})
}

func (h *ConversationHandler) GetConversations(ctx context.Context, c *app.RequestContext) {
	userID := c.GetString("user_id")
	
	conversations, err := h.conversationRepo.GetByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to get conversations",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Convert to response format
	var response []dto.ConversationResponse
	for _, conv := range conversations {
		response = append(response, dto.ConversationResponse{
			ID:           conv.ID,
			Title:        conv.Title,
			CreatedAt:    conv.CreatedAt.Format(time.RFC3339),
			UpdatedAt:    conv.UpdatedAt.Format(time.RFC3339),
			MessageCount: conv.MessageCount,
			Metadata:     conv.Metadata,
		})
	}

	c.JSON(http.StatusOK, response)
}

func (h *ConversationHandler) GetConversation(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
	conversation, err := h.conversationRepo.GetByID(conversationID)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse{
			Error: "Conversation not found",
			Code:  "NOT_FOUND",
		})
		return
	}

	// Check if user owns this conversation
	if conversation.UserID != userID {
		c.JSON(http.StatusForbidden, dto.ErrorResponse{
			Error: "Access denied",
			Code:  "FORBIDDEN",
		})
		return
	}

	c.JSON(http.StatusOK, dto.ConversationResponse{
		ID:           conversation.ID,
		Title:        conversation.Title,
		CreatedAt:    conversation.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    conversation.UpdatedAt.Format(time.RFC3339),
		MessageCount: conversation.MessageCount,
		Metadata:     conversation.Metadata,
	})
}
