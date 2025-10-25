namespace go message

struct SendMessageRequest {
    1: string role
    2: string content
    3: string model
    4: double temperature
    5: i32 maxTokens
    6: bool stream
}

struct Message {
    1: string id
    2: string role
    3: string content
    4: string createdAt
}

struct Usage {
    1: i32 promptTokens
    2: i32 completionTokens
    3: i32 totalTokens
}

struct SendMessageResponse {
    1: Message message
    2: Usage usage
}

struct StreamDelta {
    1: string delta
}

struct StreamDone {
    1: Message message
    2: Usage usage
}

service MessageService {
    SendMessageResponse SendMessage(1: SendMessageRequest req, 2: string conversationId, 3: string userId)
    // Note: Streaming will be handled via HTTP SSE, not RPC
}
