import apiClient from './apiClient.js';
import { ENDPOINTS } from './config.js';

class ModelService {
    async getModels() {
        try {
            const response = await apiClient.get(ENDPOINTS.MODELS);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get models',
                code: error.response?.data?.code || 'MODELS_ERROR',
            };
        }
    }
}

export default new ModelService();
