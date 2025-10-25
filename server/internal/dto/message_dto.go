package dto

type SendMessageRequest struct {
	Role        string  `json:"role" validate:"required,oneof=user assistant"`
	Content     string  `json:"content" validate:"required,min=1,max=10000"`
	Model       string  `json:"model" validate:"required,min=1,max=100"`
	Temperature float64 `json:"temperature,omitempty" validate:"min=0,max=2"`
	MaxTokens   int     `json:"maxTokens,omitempty" validate:"min=1,max=32000"`
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
