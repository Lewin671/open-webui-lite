package main

import (
	"context"
	"fmt"
	"log"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/cloudwego/hertz/pkg/common/utils"
	"github.com/cloudwego/hertz/pkg/protocol/consts"
	"open-webui-lite/server/internal/dto"
	"open-webui-lite/server/internal/handler"
	"open-webui-lite/server/internal/middleware"
	"open-webui-lite/server/internal/service"
	"open-webui-lite/server/pkg/config"
	"open-webui-lite/server/pkg/logger"
)

func main() {
	// Load configuration
	config.LoadConfig()
	
	// Initialize logger
	logger.InitLogger(config.AppConfig.Logging.Level, config.AppConfig.Logging.Format)
	
	// Initialize services (without database)
	aiService := service.NewMockAIService()
	
	// Initialize handlers (without database dependencies)
	modelHandler := handler.NewModelHandler()
	
	// Create a simple message handler for demo
	messageHandler := &SimpleMessageHandler{aiService: aiService}
	
	// Create Hertz server
	h := server.Default(
		server.WithHostPorts(fmt.Sprintf("%s:%s", config.AppConfig.Server.Host, config.AppConfig.Server.Port)),
	)
	
	// Add global middleware
	h.Use(middleware.CORSMiddleware())
	h.Use(middleware.LoggingMiddleware())
	h.Use(middleware.RecoveryMiddleware())
	h.Use(middleware.ErrorHandler())
	
	// Health check endpoint
	h.GET("/health", func(ctx context.Context, c *app.RequestContext) {
		c.JSON(consts.StatusOK, utils.H{"status": "ok"})
	})
	
	// API routes
	v1 := h.Group("/v1")
	{
		// Models (public endpoint)
		v1.GET("/models", modelHandler.GetModels)
		
		// Demo message endpoint (no auth required for demo)
		v1.POST("/demo/message", messageHandler.SendMessage)
	}
	
	// Start server
	log.Printf("Server starting on %s:%s", config.AppConfig.Server.Host, config.AppConfig.Server.Port)
	log.Printf("Demo endpoints available:")
	log.Printf("  GET  /health - Health check")
	log.Printf("  GET  /v1/models - Get available models")
	log.Printf("  POST /v1/demo/message - Send message (demo)")
	h.Spin()
}

// Simple message handler for demo
type SimpleMessageHandler struct {
	aiService *service.MockAIService
}

func (h *SimpleMessageHandler) SendMessage(ctx context.Context, c *app.RequestContext) {
	var req struct {
		Content string `json:"content" binding:"required"`
		Model   string `json:"model,omitempty"`
	}
	
	if err := c.BindAndValidate(&req); err != nil {
		c.JSON(consts.StatusBadRequest, utils.H{
			"error": "Invalid request parameters",
			"code":  "VALIDATION_ERROR",
		})
		return
	}
	
	// Generate AI response
	aiResponse, err := h.aiService.GenerateResponse(ctx, dto.SendMessageRequest{
		Role:        "user",
		Content:     req.Content,
		Model:       req.Model,
		Temperature: 0.7,
		MaxTokens:   1000,
		Stream:      false,
	})
	
	if err != nil {
		c.JSON(consts.StatusInternalServerError, utils.H{
			"error": "Failed to generate AI response",
			"code":  "INTERNAL_ERROR",
		})
		return
	}
	
	c.JSON(consts.StatusOK, aiResponse)
}
