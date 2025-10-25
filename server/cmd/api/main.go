package main

import (
	"context"
	"fmt"
	"log"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/cloudwego/hertz/pkg/common/utils"
	"github.com/cloudwego/hertz/pkg/protocol/consts"
	"open-webui-lite/server/internal/handler"
	"open-webui-lite/server/internal/middleware"
	"open-webui-lite/server/internal/repository"
	"open-webui-lite/server/internal/service"
	"open-webui-lite/server/pkg/config"
	"open-webui-lite/server/pkg/database"
	"open-webui-lite/server/pkg/logger"
)

func main() {
	// Load configuration
	config.LoadConfig()
	
	// Initialize logger
	logger.InitLogger(config.AppConfig.Logging.Level, config.AppConfig.Logging.Format)
	
	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	
	// Initialize repositories
	userRepo := repository.NewUserRepository()
	conversationRepo := repository.NewConversationRepository()
	messageRepo := repository.NewMessageRepository()
	
	// Initialize services
	aiService := service.NewMockAIService()
	
	// Initialize handlers
	authHandler := handler.NewAuthHandler(userRepo)
	conversationHandler := handler.NewConversationHandler(conversationRepo)
	messageHandler := handler.NewMessageHandler(messageRepo, conversationRepo, aiService)
	modelHandler := handler.NewModelHandler()
	
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
		// Authentication routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.Refresh)
		}
		
		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// User info
			protected.GET("/me", authHandler.GetUserInfo)
			
			// Conversations
			conversations := protected.Group("/conversations")
			{
				conversations.POST("", conversationHandler.CreateConversation)
				conversations.GET("/:id", conversationHandler.GetConversation)
			}
			
			// Messages
			messages := protected.Group("/conversations/:id/messages")
			{
				messages.POST("", messageHandler.SendMessage)
			}
		}
		
		// Models (public endpoint)
		v1.GET("/models", modelHandler.GetModels)
	}
	
	// Start server
	log.Printf("Server starting on %s:%s", config.AppConfig.Server.Host, config.AppConfig.Server.Port)
	h.Spin()
}
