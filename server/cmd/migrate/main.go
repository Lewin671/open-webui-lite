package main

import (
	"log"
	"open-webui-lite/server/pkg/config"
	"open-webui-lite/server/pkg/database"
	"open-webui-lite/server/pkg/logger"
)

func main() {
	// Load configuration
	config.LoadConfig()
	
	// Initialize logger
	logger.InitLogger(config.AppConfig.Logging.Level, config.AppConfig.Logging.Format)
	
	// Connect to database (this will run auto-migration)
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	
	log.Println("Database migration completed")
}
