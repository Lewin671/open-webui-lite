// API Configuration
const API_CONFIG = {
    // Default backend URL - can be overridden by environment variables
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    API_VERSION: '/v1',
    TIMEOUT: 30000, // 30 seconds
    STREAM_TIMEOUT: 300000, // 5 minutes for streaming
};

// Build full API URL
export const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;

// API endpoints
export const ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/me',

    // Conversation endpoints
    CONVERSATIONS: '/conversations',
    CONVERSATION_BY_ID: (id) => `/conversations/${id}`,

    // Message endpoints
    MESSAGES: (conversationId) => `/conversations/${conversationId}/messages`,

    // Model endpoints
    MODELS: '/models',

    // Health check
    HEALTH: '/health',
};

// Request headers
export const HEADERS = {
    JSON: {
        'Content-Type': 'application/json',
    },
    STREAM: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
    },
};

export { API_CONFIG };
export default API_CONFIG;
