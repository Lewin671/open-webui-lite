import apiClient from './apiClient.js';
import { ENDPOINTS, HEADERS, API_CONFIG } from './config.js';

class MessageService {
    async getMessages(conversationId) {
        try {
            const response = await apiClient.get(ENDPOINTS.MESSAGES(conversationId));
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get messages',
                code: error.response?.data?.code || 'MESSAGES_ERROR',
            };
        }
    }

    async sendMessage(conversationId, messageData) {
        try {
            const response = await apiClient.post(ENDPOINTS.MESSAGES(conversationId), messageData);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to send message',
                code: error.response?.data?.code || 'SEND_MESSAGE_ERROR',
            };
        }
    }

    async sendMessageStream(conversationId, messageData, onDelta, onDone, onError) {
        try {
            const token = localStorage.getItem('access_token');

            const response = await fetch(`${apiClient.defaults.baseURL}${ENDPOINTS.MESSAGES(conversationId)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    ...HEADERS.STREAM,
                },
                body: JSON.stringify({
                    ...messageData,
                    stream: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim() === '') continue;

                    if (line.startsWith('event: ')) {
                        const eventType = line.substring(7);

                        if (eventType === 'message.delta') {
                            // Next line should be the data
                            continue;
                        } else if (eventType === 'message.done') {
                            // Next line should be the final data
                            continue;
                        }
                    } else if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));

                            if (data.delta) {
                                onDelta(data);
                            } else if (data.message) {
                                onDone(data);
                            }
                        } catch (parseError) {
                            console.error('Error parsing SSE data:', parseError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming error:', error);
            onError(error);
        }
    }
}

export default new MessageService();
