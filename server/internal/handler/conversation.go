package handler

import (
    "context"
    "net/http"
    "strconv"
    "time"

    "github.com/cloudwego/hertz/pkg/app"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/middleware"
    "open-webui-lite/server/internal/service"
)

type ConversationHandler struct { svc service.ConversationService }

func NewConversationHandler(svc service.ConversationService) *ConversationHandler { return &ConversationHandler{svc: svc} }

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
    conversation, err := h.svc.Create(userID, req)
    if err != nil {
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
	
    conversations, total, err := h.svc.List(userID, page, limit, search)
	
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
	
    conversation, err := h.svc.Get(userID, conversationID)
	if err != nil {
        status := http.StatusNotFound
        code := "NOT_FOUND"
        if err == service.ErrForbidden { status = http.StatusForbidden; code = "FORBIDDEN" }
        c.JSON(status, dto.ErrorResponse{ Error: "Conversation not found", Code: code })
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
	
    // Delete the conversation
    if err := h.svc.Delete(userID, conversationID); err != nil {
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
	
    // Ownership validation is enforced in service

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

    // Save updated conversation
    conversation, err := h.svc.Update(userID, conversationID, req)
    if err != nil {
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
