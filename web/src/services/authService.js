import apiClient, { tokenManager } from './apiClient.js';
import { ENDPOINTS } from './config.js';

class AuthService {
    async login(email, password) {
        try {
            const response = await apiClient.post(ENDPOINTS.LOGIN, {
                email,
                password,
            });

            const { access_token, refresh_token, expires_in } = response.data;

            // Store tokens
            tokenManager.setTokens(access_token, refresh_token);

            return {
                success: true,
                data: {
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    expiresIn: expires_in,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed',
                code: error.response?.data?.code || 'LOGIN_ERROR',
            };
        }
    }

    async refreshToken() {
        try {
            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await apiClient.post(ENDPOINTS.REFRESH, {
                refresh_token: refreshToken,
            });

            const { access_token, expires_in } = response.data;

            // Update access token
            tokenManager.setTokens(access_token, refreshToken);

            return {
                success: true,
                data: {
                    accessToken: access_token,
                    expiresIn: expires_in,
                },
            };
        } catch (error) {
            // Clear tokens if refresh fails
            tokenManager.clearTokens();
            return {
                success: false,
                error: error.response?.data?.error || 'Token refresh failed',
                code: error.response?.data?.code || 'REFRESH_ERROR',
            };
        }
    }

    async getUserInfo() {
        try {
            const response = await apiClient.get(ENDPOINTS.ME);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get user info',
                code: error.response?.data?.code || 'USER_INFO_ERROR',
            };
        }
    }

    logout() {
        tokenManager.clearTokens();
    }

    isAuthenticated() {
        return tokenManager.isAuthenticated();
    }

    getAccessToken() {
        return tokenManager.getAccessToken();
    }
}

export default new AuthService();
