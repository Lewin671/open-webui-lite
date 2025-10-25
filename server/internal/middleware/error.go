package middleware

import (
	"context"
	"net/http"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/rs/zerolog/log"
	"open-webui-lite/server/internal/dto"
)

func ErrorHandler() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		c.Next(ctx)
		
		// Check if there's an error
		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			log.Error().Err(err).Msg("Request error")
			
			c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
				Error: "Internal server error",
				Code:  "INTERNAL_ERROR",
			})
		}
	}
}

func RecoveryMiddleware() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		defer func() {
			if r := recover(); r != nil {
				log.Error().Interface("panic", r).Msg("Panic recovered")
				
				c.JSON(http.StatusInternalServerError, dto.ErrorResponse{
					Error: "Internal server error",
					Code:  "INTERNAL_ERROR",
				})
			}
		}()
		
		c.Next(ctx)
	}
}
