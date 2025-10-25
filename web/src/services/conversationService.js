import apiClient from './apiClient.js';
import { ENDPOINTS } from './config.js';

class ConversationService {
    async getConversations() {
        try {
            const response = await apiClient.get(ENDPOINTS.CONVERSATIONS);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get conversations',
                code: error.response?.data?.code || 'CONVERSATIONS_ERROR',
            };
        }
    }

    async getConversation(id) {
        try {
            const response = await apiClient.get(ENDPOINTS.CONVERSATION_BY_ID(id));
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get conversation',
                code: error.response?.data?.code || 'CONVERSATION_ERROR',
            };
        }
    }

    async createConversation(title, metadata = {}) {
        try {
            const response = await apiClient.post(ENDPOINTS.CONVERSATIONS, {
                title,
                metadata,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to create conversation',
                code: error.response?.data?.code || 'CREATE_CONVERSATION_ERROR',
            };
        }
    }

    async updateConversation(id, updates) {
        try {
            const response = await apiClient.put(ENDPOINTS.CONVERSATION_BY_ID(id), updates);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to update conversation',
                code: error.response?.data?.code || 'UPDATE_CONVERSATION_ERROR',
            };
        }
    }

    async deleteConversation(id) {
        try {
            await apiClient.delete(ENDPOINTS.CONVERSATION_BY_ID(id));
            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete conversation',
                code: error.response?.data?.code || 'DELETE_CONVERSATION_ERROR',
            };
        }
    }
}

export default new ConversationService();
