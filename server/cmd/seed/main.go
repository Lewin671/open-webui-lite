package main

import (
	"log"
	"open-webui-lite/server/internal/model"
	"open-webui-lite/server/internal/repository"
	"open-webui-lite/server/pkg/config"
	"open-webui-lite/server/pkg/database"
	"open-webui-lite/server/pkg/logger"

	"golang.org/x/crypto/bcrypt"
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
	
	// Initialize repository
	userRepo := repository.NewUserRepository()
	
	// Create test user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}
	
	testUser := &model.User{
		Email:    "test@example.com",
		Password: string(hashedPassword),
		Name:     "Test User",
		Avatar:   "https://example.com/avatar.jpg",
	}
	
	if err := userRepo.Create(testUser); err != nil {
		log.Printf("User might already exist: %v", err)
	} else {
		log.Printf("Created test user: %s", testUser.Email)
	}
	
	log.Println("Database seeding completed")
}
