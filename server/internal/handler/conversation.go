package handler

import (
    "context"
    "net/http"
    "strconv"

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
    resp, err := h.svc.Create(userID, req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: "Failed to create conversation", Code: "INTERNAL_ERROR"})
        return
    }
    c.JSON(http.StatusCreated, resp)
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
	
    resp, err := h.svc.List(userID, page, limit, search)
    if err != nil {
        c.JSON(http.StatusInternalServerError, dto.ErrorResponse{Error: "Failed to get conversations", Code: "INTERNAL_ERROR"})
        return
    }
    c.JSON(http.StatusOK, resp)
}

func (h *ConversationHandler) GetConversation(ctx context.Context, c *app.RequestContext) {
    conversationID := c.Param("id")
    userID := c.GetString("user_id")
    resp, err := h.svc.Get(userID, conversationID)
    if err != nil {
        status := http.StatusInternalServerError
        code := "INTERNAL_ERROR"
        if err == service.ErrNotFound {
            status = http.StatusNotFound
            code = "NOT_FOUND"
        } else if err == service.ErrUnauthorized {
            status = http.StatusForbidden
            code = "FORBIDDEN"
        }
        c.JSON(status, dto.ErrorResponse{Error: http.StatusText(status), Code: code})
        return
    }
    c.JSON(http.StatusOK, resp)
}

func (h *ConversationHandler) DeleteConversation(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
    if err := h.svc.Delete(userID, conversationID); err != nil {
        status := http.StatusInternalServerError
        code := "INTERNAL_ERROR"
        if err == service.ErrNotFound {
            status = http.StatusNotFound
            code = "NOT_FOUND"
        } else if err == service.ErrUnauthorized {
            status = http.StatusForbidden
            code = "FORBIDDEN"
        }
        c.JSON(status, dto.ErrorResponse{Error: http.StatusText(status), Code: code})
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

    resp, err := h.svc.Update(userID, conversationID, req)
    if err != nil {
        status := http.StatusInternalServerError
        code := "INTERNAL_ERROR"
        if err == service.ErrNotFound {
            status = http.StatusNotFound
            code = "NOT_FOUND"
        } else if err == service.ErrUnauthorized {
            status = http.StatusForbidden
            code = "FORBIDDEN"
        }
        c.JSON(status, dto.ErrorResponse{Error: http.StatusText(status), Code: code})
        return
    }
    c.JSON(http.StatusOK, resp)
}
