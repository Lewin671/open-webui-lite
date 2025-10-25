package config

import (
	"fmt"
	"log"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	JWT      JWTConfig      `mapstructure:"jwt"`
	Logging  LoggingConfig  `mapstructure:"logging"`
	CORS     CORSConfig     `mapstructure:"cors"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
	Host string `mapstructure:"host"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	Name     string `mapstructure:"name"`
	SSLMode  string `mapstructure:"ssl_mode"`
}

type JWTConfig struct {
	Secret        string `mapstructure:"secret"`
	AccessExpire  int    `mapstructure:"access_expire"`
	RefreshExpire int    `mapstructure:"refresh_expire"`
}

type LoggingConfig struct {
	Level  string `mapstructure:"level"`
	Format string `mapstructure:"format"`
}

type CORSConfig struct {
	AllowedOrigins string `mapstructure:"allowed_origins"`
	AllowedMethods string `mapstructure:"allowed_methods"`
	AllowedHeaders string `mapstructure:"allowed_headers"`
}

var AppConfig *Config

func LoadConfig() {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AddConfigPath("./server")

	// Set default values
	viper.SetDefault("SERVER_PORT", "8080")
	viper.SetDefault("SERVER_HOST", "localhost")
	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_PORT", "5432")
	viper.SetDefault("DB_USER", "postgres")
	viper.SetDefault("DB_PASSWORD", "password")
	viper.SetDefault("DB_NAME", "open_webui_lite")
	viper.SetDefault("DB_SSL_MODE", "disable")
	viper.SetDefault("JWT_SECRET", "your-secret-key-here")
	viper.SetDefault("JWT_ACCESS_EXPIRE", 3600)
	viper.SetDefault("JWT_REFRESH_EXPIRE", 604800)
	viper.SetDefault("LOG_LEVEL", "info")
	viper.SetDefault("LOG_FORMAT", "json")
	viper.SetDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
	viper.SetDefault("CORS_ALLOWED_METHODS", "GET,POST,PUT,DELETE,OPTIONS")
	viper.SetDefault("CORS_ALLOWED_HEADERS", "Content-Type,Authorization")

	// Enable reading from environment variables
	viper.AutomaticEnv()

	// Read config file if it exists
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			log.Printf("Error reading config file: %v", err)
		}
	}

	// Unmarshal config
	AppConfig = &Config{}
	if err := viper.Unmarshal(AppConfig); err != nil {
		log.Printf("Unable to decode config into struct: %v", err)
	}
	
	// If config is empty, use defaults
	if AppConfig.Server.Port == "" {
		AppConfig.Server.Port = "8080"
	}
	if AppConfig.Server.Host == "" {
		AppConfig.Server.Host = "localhost"
	}
	if AppConfig.Database.Host == "" {
		AppConfig.Database.Host = "localhost"
	}
	if AppConfig.Database.Port == "" {
		AppConfig.Database.Port = "5432"
	}
	if AppConfig.Database.User == "" {
		AppConfig.Database.User = "postgres"
	}
	if AppConfig.Database.Password == "" {
		AppConfig.Database.Password = "password"
	}
	if AppConfig.Database.Name == "" {
		AppConfig.Database.Name = "open_webui_lite"
	}
	if AppConfig.Database.SSLMode == "" {
		AppConfig.Database.SSLMode = "disable"
	}
	if AppConfig.JWT.Secret == "" {
		AppConfig.JWT.Secret = "your-secret-key-here"
	}
	if AppConfig.JWT.AccessExpire == 0 {
		AppConfig.JWT.AccessExpire = 3600
	}
	if AppConfig.JWT.RefreshExpire == 0 {
		AppConfig.JWT.RefreshExpire = 604800
	}
	if AppConfig.Logging.Level == "" {
		AppConfig.Logging.Level = "info"
	}
	if AppConfig.Logging.Format == "" {
		AppConfig.Logging.Format = "json"
	}
	if AppConfig.CORS.AllowedOrigins == "" {
		AppConfig.CORS.AllowedOrigins = "http://localhost:5173,http://localhost:3000"
	}
	if AppConfig.CORS.AllowedMethods == "" {
		AppConfig.CORS.AllowedMethods = "GET,POST,PUT,DELETE,OPTIONS"
	}
	if AppConfig.CORS.AllowedHeaders == "" {
		AppConfig.CORS.AllowedHeaders = "Content-Type,Authorization"
	}

	// Override with environment variables if they exist
	if port := os.Getenv("SERVER_PORT"); port != "" {
		AppConfig.Server.Port = port
	}
	if host := os.Getenv("SERVER_HOST"); host != "" {
		AppConfig.Server.Host = host
	}
	if dbHost := os.Getenv("DB_HOST"); dbHost != "" {
		AppConfig.Database.Host = dbHost
	}
	if dbPort := os.Getenv("DB_PORT"); dbPort != "" {
		AppConfig.Database.Port = dbPort
	}
	if dbUser := os.Getenv("DB_USER"); dbUser != "" {
		AppConfig.Database.User = dbUser
	}
	if dbPassword := os.Getenv("DB_PASSWORD"); dbPassword != "" {
		AppConfig.Database.Password = dbPassword
	}
	if dbName := os.Getenv("DB_NAME"); dbName != "" {
		AppConfig.Database.Name = dbName
	}
	if dbSSLMode := os.Getenv("DB_SSL_MODE"); dbSSLMode != "" {
		AppConfig.Database.SSLMode = dbSSLMode
	}
	if jwtSecret := os.Getenv("JWT_SECRET"); jwtSecret != "" {
		AppConfig.JWT.Secret = jwtSecret
	}
	
	// Debug: Print loaded config
	fmt.Printf("Loaded config: %+v\n", AppConfig)
}
