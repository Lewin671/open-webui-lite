package middleware

import (
	"context"
	"strings"

	"github.com/cloudwego/hertz/pkg/app"
	"open-webui-lite/server/pkg/config"
)

func CORSMiddleware() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		cfg := config.AppConfig.CORS
		
		// Parse allowed origins
		allowedOrigins := strings.Split(cfg.AllowedOrigins, ",")
		origin := string(c.Request.Header.Peek("Origin"))
		
		// Check if origin is allowed
		allowed := false
		for _, allowedOrigin := range allowedOrigins {
			if strings.TrimSpace(allowedOrigin) == origin {
				allowed = true
				break
			}
		}
		
		if allowed {
			c.Response.Header.Set("Access-Control-Allow-Origin", origin)
		}
		
		c.Response.Header.Set("Access-Control-Allow-Methods", cfg.AllowedMethods)
		c.Response.Header.Set("Access-Control-Allow-Headers", cfg.AllowedHeaders)
		c.Response.Header.Set("Access-Control-Allow-Credentials", "true")
		c.Response.Header.Set("Access-Control-Max-Age", "86400")
		
		// Handle preflight requests
		if string(c.Request.Method()) == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next(ctx)
	}
}
