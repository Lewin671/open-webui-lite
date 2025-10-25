namespace go conversation

struct CreateConversationRequest {
    1: string title
    2: map<string, string> metadata
}

struct Conversation {
    1: string id
    2: string title
    3: string createdAt
    4: string updatedAt
    5: i32 messageCount
    6: map<string, string> metadata
}

struct CreateConversationResponse {
    1: Conversation conversation
}

struct GetConversationResponse {
    1: Conversation conversation
}

service ConversationService {
    CreateConversationResponse CreateConversation(1: CreateConversationRequest req, 2: string userId)
    GetConversationResponse GetConversation(1: string conversationId, 2: string userId)
}
