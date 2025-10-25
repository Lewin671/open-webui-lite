package dto

type ErrorResponse struct {
	Error   string                 `json:"error"`
	Code    string                 `json:"code"`
	Details map[string]interface{} `json:"details,omitempty"`
}
