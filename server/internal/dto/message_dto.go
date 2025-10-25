package dto

type SendMessageRequest struct {
	Role        string  `json:"role" binding:"required"`
	Content     string  `json:"content" binding:"required"`
	Model       string  `json:"model" binding:"required"`
	Temperature float64 `json:"temperature,omitempty"`
	MaxTokens   int     `json:"maxTokens,omitempty"`
	Stream      bool    `json:"stream,omitempty"`
}

type MessageResponse struct {
	ID        string `json:"id"`
	Role      string `json:"role"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
}

type Usage struct {
	PromptTokens     int `json:"promptTokens"`
	CompletionTokens int `json:"completionTokens"`
	TotalTokens      int `json:"totalTokens"`
}

type SendMessageResponse struct {
	Message MessageResponse `json:"message"`
	Usage   Usage           `json:"usage"`
}

type StreamDelta struct {
	Delta string `json:"delta"`
}

type StreamDone struct {
	Message MessageResponse `json:"message"`
	Usage   Usage           `json:"usage"`
}
