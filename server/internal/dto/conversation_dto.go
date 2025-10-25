package dto

type CreateConversationRequest struct {
	Title    string                 `json:"title" binding:"required"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

type ConversationResponse struct {
	ID           string                 `json:"id"`
	Title        string                 `json:"title"`
	CreatedAt    string                 `json:"createdAt"`
	UpdatedAt    string                 `json:"updatedAt"`
	MessageCount int                    `json:"messageCount,omitempty"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}
