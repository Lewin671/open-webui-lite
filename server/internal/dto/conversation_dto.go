package dto

type CreateConversationRequest struct {
	Title    string                 `json:"title" validate:"required,min=1,max=200"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

type UpdateConversationRequest struct {
	Title    string                 `json:"title,omitempty" validate:"omitempty,min=1,max=200"`
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

type PaginatedConversationsResponse struct {
	Conversations []ConversationResponse `json:"conversations"`
	Total         int64                  `json:"total"`
	Page          int                    `json:"page"`
	Limit         int                    `json:"limit"`
	TotalPages    int                    `json:"totalPages"`
}
