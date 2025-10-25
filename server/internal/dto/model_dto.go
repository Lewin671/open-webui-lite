package dto

type AIModel struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Context     int    `json:"context"`
	MaxTokens   int    `json:"maxTokens"`
	Description string `json:"description"`
	Available   bool   `json:"available"`
}

type GetModelsResponse struct {
	Data []AIModel `json:"data"`
}
