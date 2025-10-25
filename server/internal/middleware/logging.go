package middleware

import (
	"context"
	"time"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/rs/zerolog/log"
)

func LoggingMiddleware() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		start := time.Now()
		
		// Log request
		log.Info().
			Str("method", string(c.Request.Method())).
			Str("path", string(c.Request.Path())).
			Str("ip", c.ClientIP()).
			Msg("Request started")
		
		c.Next(ctx)
		
		// Log response
		duration := time.Since(start)
		log.Info().
			Str("method", string(c.Request.Method())).
			Str("path", string(c.Request.Path())).
			Int("status", c.Response.StatusCode()).
			Dur("duration", duration).
			Msg("Request completed")
	}
}
