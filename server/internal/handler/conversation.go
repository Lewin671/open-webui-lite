package handler

import (
	"context"
	"net/http"
	"strconv"
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
	
	// Get query parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "20")
	
	page := 1
	limit := 20
	
	// Parse page parameter
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	
	// Parse limit parameter
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	search := c.Query("search")
	
	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	
	var conversations []*model.Conversation
	var total int64
	var err error
	
	// Check if search is provided
	if search != "" {
		conversations, total, err = h.conversationRepo.SearchByUserID(userID, search, page, limit)
	} else {
		conversations, total, err = h.conversationRepo.GetByUserIDWithPagination(userID, page, limit)
	}
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to get conversations",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Convert to response format
	var responseConversations []dto.ConversationResponse
	for _, conv := range conversations {
		responseConversations = append(responseConversations, dto.ConversationResponse{
			ID:           conv.ID,
			Title:        conv.Title,
			CreatedAt:    conv.CreatedAt.Format(time.RFC3339),
			UpdatedAt:    conv.UpdatedAt.Format(time.RFC3339),
			MessageCount: conv.MessageCount,
			Metadata:     conv.Metadata,
		})
	}

	// Calculate total pages
	totalPages := int((total + int64(limit) - 1) / int64(limit))

	response := dto.PaginatedConversationsResponse{
		Conversations: responseConversations,
		Total:         total,
		Page:          page,
		Limit:         limit,
		TotalPages:    totalPages,
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

func (h *ConversationHandler) DeleteConversation(ctx context.Context, c *app.RequestContext) {
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

	// Delete the conversation
	if err := h.conversationRepo.Delete(conversationID); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to delete conversation",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse{
		Success: true,
		Message: "Conversation deleted successfully",
	})
}

func (h *ConversationHandler) UpdateConversation(ctx context.Context, c *app.RequestContext) {
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

	var req dto.UpdateConversationRequest
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

	// Update conversation fields
	if req.Title != "" {
		conversation.Title = req.Title
	}
	if req.Metadata != nil {
		conversation.Metadata = req.Metadata
	}

	// Save updated conversation
	if err := h.conversationRepo.Update(conversation); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to update conversation",
			Code:  "INTERNAL_ERROR",
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
