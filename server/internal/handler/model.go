package handler

import (
	"context"
	"net/http"

	"github.com/cloudwego/hertz/pkg/app"
	"open-webui-lite/server/internal/dto"
)

type ModelHandler struct{}

func NewModelHandler() *ModelHandler {
	return &ModelHandler{}
}

func (h *ModelHandler) GetModels(ctx context.Context, c *app.RequestContext) {
	models := []dto.AIModel{
		{
			ID:          "gpt-4",
			Name:        "GPT-4",
			Context:     128000,
			MaxTokens:   4096,
			Description: "最强大的GPT-4模型",
			Available:   true,
		},
		{
			ID:          "gpt-3.5-turbo",
			Name:        "GPT-3.5 Turbo",
			Context:     16384,
			MaxTokens:   4096,
			Description: "快速且经济的模型",
			Available:   true,
		},
		{
			ID:          "claude-3-opus",
			Name:        "Claude 3 Opus",
			Context:     200000,
			MaxTokens:   4096,
			Description: "Anthropic的Claude 3 Opus模型",
			Available:   true,
		},
		{
			ID:          "claude-3-sonnet",
			Name:        "Claude 3 Sonnet",
			Context:     200000,
			MaxTokens:   4096,
			Description: "Anthropic的Claude 3 Sonnet模型",
			Available:   true,
		},
	}

	c.JSON(http.StatusOK, dto.GetModelsResponse{
		Data: models,
	})
}
