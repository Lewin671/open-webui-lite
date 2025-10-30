package handler

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"

    "github.com/cloudwego/hertz/pkg/app"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/middleware"
    "open-webui-lite/server/internal/service"
)

type MessageHandler struct { svc service.MessageService; ai *service.MockAIService }

func NewMessageHandler(svc service.MessageService, aiService *service.MockAIService) *MessageHandler {
    return &MessageHandler{svc: svc, ai: aiService}
}

func (h *MessageHandler) SendMessage(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
    var req dto.SendMessageRequest
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

	// Check if streaming is requested
	acceptHeader := string(c.Request.Header.Peek("Accept"))
	if req.Stream && acceptHeader == "text/event-stream" {
        h.handleStreamingResponse(ctx, c, conversationID, userID, req)
		return
	}

    resp, err := h.svc.Send(req, conversationID, userID, h.ai)
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

func (h *MessageHandler) handleStreamingResponse(ctx context.Context, c *app.RequestContext, conversationID, userID string, req dto.SendMessageRequest) {
	// Set SSE headers
	c.Response.Header.Set("Content-Type", "text/event-stream")
	c.Response.Header.Set("Cache-Control", "no-cache")
	c.Response.Header.Set("Connection", "keep-alive")
	c.Response.Header.Set("Access-Control-Allow-Origin", "*")

    // Create a channel for streaming
    deltaChan := make(chan dto.StreamDelta, 100)

    // Stream deltas
    go func() {
        h.ai.GenerateStreamResponse(ctx, req, func(delta dto.StreamDelta) {
            deltaChan <- delta
        })
        close(deltaChan)
    }()

    for delta := range deltaChan {
        eventData, _ := json.Marshal(delta)
        fmt.Fprintf(c.Response.BodyWriter(), "event: message.delta\n")
        fmt.Fprintf(c.Response.BodyWriter(), "data: %s\n\n", string(eventData))
    }

    done, _ := h.svc.SendStream(req, conversationID, userID, h.ai, func(d dto.StreamDelta) {})
    eventData, _ := json.Marshal(done)
    fmt.Fprintf(c.Response.BodyWriter(), "event: message.done\n")
    fmt.Fprintf(c.Response.BodyWriter(), "data: %s\n\n", string(eventData))
}

func (h *MessageHandler) GetMessages(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
    

	// Get query parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "50")
	
	page := 1
	limit := 50
	
	// Parse page parameter
	if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
		page = p
	}
	
	// Parse limit parameter
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}
	
	// Validate pagination parameters
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 50
	}

    resp, err := h.svc.List(conversationID, userID, page, limit)
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
