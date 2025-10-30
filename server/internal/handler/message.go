package handler

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"
    "strconv"
    "time"

    "github.com/cloudwego/hertz/pkg/app"
    "open-webui-lite/server/internal/dto"
    "open-webui-lite/server/internal/middleware"
    "open-webui-lite/server/internal/service"
)

type MessageHandler struct { svc service.MessageService }

func NewMessageHandler(svc service.MessageService) *MessageHandler { return &MessageHandler{svc: svc} }

func (h *MessageHandler) SendMessage(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
    // ownership will be enforced by service layer

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

    assistantMessage, usage, err := h.svc.Send(ctx, userID, conversationID, req)
    if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to save assistant message",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Return response
	c.JSON(http.StatusOK, dto.SendMessageResponse{
		Message: dto.MessageResponse{
			ID:        assistantMessage.ID,
			Role:      assistantMessage.Role,
			Content:   assistantMessage.Content,
			CreatedAt: assistantMessage.CreatedAt.Format(time.RFC3339),
		},
        Usage: usage,
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
        _, _, _ = h.svc.SendStream(ctx, userID, conversationID, req, func(delta dto.StreamDelta) {
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

    // Final message persisted by service; we only need to fetch last saved in channel loop.

	// Send final message
    finalMessage := dto.StreamDone{ Message: dto.MessageResponse{ ID: "", Role: "assistant", Content: fullContent, CreatedAt: time.Now().Format(time.RFC3339) }, Usage: dto.Usage{ PromptTokens: len(req.Content)/4, CompletionTokens: len(fullContent)/4, TotalTokens: (len(req.Content)+len(fullContent))/4 } }

	eventData, _ := json.Marshal(finalMessage)
	fmt.Fprintf(c.Response.BodyWriter(), "event: message.done\n")
	fmt.Fprintf(c.Response.BodyWriter(), "data: %s\n\n", string(eventData))
	// Flush is not available on io.Writer, but Hertz handles this automatically
}

func (h *MessageHandler) GetMessages(ctx context.Context, c *app.RequestContext) {
	conversationID := c.Param("id")
	userID := c.GetString("user_id")
	
    // ownership enforced by service layer

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

    // Get messages for this conversation with pagination
    messages, total, err := h.svc.List(userID, conversationID, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
			Error: "Failed to get messages",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	// Convert to response format
	var responseMessages []dto.MessageResponse
	for _, msg := range messages {
		responseMessages = append(responseMessages, dto.MessageResponse{
			ID:        msg.ID,
			Role:      msg.Role,
			Content:   msg.Content,
			CreatedAt: msg.CreatedAt.Format(time.RFC3339),
		})
	}

	// Calculate total pages
	totalPages := int((total + int64(limit) - 1) / int64(limit))

	response := dto.PaginatedMessagesResponse{
		Messages:   responseMessages,
		Total:      total,
		Page:       page,
		Limit:     limit,
		TotalPages: totalPages,
	}

	c.JSON(http.StatusOK, response)
}
