package service

import (
	"context"
	"fmt"
	"math/rand"
	"strings"
	"time"

	"open-webui-lite/server/internal/dto"
)

type MockAIService struct {
	responses []string
}

func NewMockAIService() *MockAIService {
	return &MockAIService{
		responses: []string{
			"这是一个很好的问题！让我来帮你解答。",
			"根据你的需求，我建议采用以下方案：",
			"让我为你提供一个详细的解决方案：",
			"这是一个常见的问题，我来为你分析一下：",
			"基于我的理解，我认为最好的方法是：",
		},
	}
}

func (s *MockAIService) GenerateResponse(ctx context.Context, request dto.SendMessageRequest) (*dto.SendMessageResponse, error) {
	// Simulate processing time
	time.Sleep(time.Duration(rand.Intn(2000)+500) * time.Millisecond)
	
	// Generate mock response
	response := s.generateMockContent(request.Content)
	
	// Calculate mock usage
	usage := s.calculateUsage(request.Content, response)
	
	return &dto.SendMessageResponse{
		Message: dto.MessageResponse{
			ID:        generateID(),
			Role:      "assistant",
			Content:   response,
			CreatedAt: time.Now().Format(time.RFC3339),
		},
		Usage: usage,
	}, nil
}

func (s *MockAIService) GenerateStreamResponse(ctx context.Context, request dto.SendMessageRequest, callback func(dto.StreamDelta)) error {
	response := s.generateMockContent(request.Content)
	
	// Split response into chunks for streaming
	chunks := s.splitIntoChunks(response)
	
	for _, chunk := range chunks {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			callback(dto.StreamDelta{Delta: chunk})
			// Simulate streaming delay
			time.Sleep(time.Duration(rand.Intn(100)+50) * time.Millisecond)
		}
	}
	
	return nil
}

func (s *MockAIService) generateMockContent(userInput string) string {
	// Simple mock response generation
	baseResponse := s.responses[rand.Intn(len(s.responses))]
	
	// Add some context based on user input
	if strings.Contains(strings.ToLower(userInput), "python") {
		baseResponse += "\n\n```python\ndef example():\n    return 'Hello, World!'\n```"
	} else if strings.Contains(strings.ToLower(userInput), "javascript") {
		baseResponse += "\n\n```javascript\nfunction example() {\n    return 'Hello, World!';\n}\n```"
	} else if strings.Contains(strings.ToLower(userInput), "代码") || strings.Contains(strings.ToLower(userInput), "code") {
		baseResponse += "\n\n这是一个示例代码片段，展示了如何实现你提到的功能。"
	}
	
	// Add some additional content
	baseResponse += "\n\n如果你需要更详细的解释或有其他问题，请随时告诉我！"
	
	return baseResponse
}

func (s *MockAIService) splitIntoChunks(text string) []string {
	chunks := []string{}
	words := strings.Fields(text)
	
	for i := 0; i < len(words); i += 2 {
		end := i + 2
		if end > len(words) {
			end = len(words)
		}
		chunk := strings.Join(words[i:end], " ")
		chunks = append(chunks, chunk+" ")
	}
	
	return chunks
}

func (s *MockAIService) calculateUsage(prompt, completion string) dto.Usage {
	// Rough token estimation (1 token ≈ 4 characters for Chinese, 1 token ≈ 4 characters for English)
	promptTokens := len(prompt) / 4
	completionTokens := len(completion) / 4
	
	return dto.Usage{
		PromptTokens:     promptTokens,
		CompletionTokens: completionTokens,
		TotalTokens:      promptTokens + completionTokens,
	}
}

func generateID() string {
	return fmt.Sprintf("msg_%d", time.Now().UnixNano())
}
