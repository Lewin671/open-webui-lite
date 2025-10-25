import apiClient, { tokenManager } from './apiClient.js';
import { ENDPOINTS } from './config.js';

class AuthService {
    async login(email, password) {
        try {
            console.log('Attempting login with email:', email);
            
            const response = await apiClient.post(ENDPOINTS.LOGIN, {
                email,
                password,
            });

            console.log('Login response:', {
                status: response.status,
                hasData: !!response.data,
                dataKeys: response.data ? Object.keys(response.data) : []
            });

            if (!response.data) {
                throw new Error('No data received from server');
            }

            const { accessToken, refreshToken, expiresIn } = response.data;

            if (!accessToken) {
                throw new Error('No access token received from server');
            }

            console.log('Tokens received:', {
                hasAccessToken: !!accessToken,
                accessTokenLength: accessToken?.length,
                hasRefreshToken: !!refreshToken,
                refreshTokenLength: refreshToken?.length,
                expiresIn: expiresIn
            });

            // Store tokens
            tokenManager.setTokens(accessToken, refreshToken);

            return {
                success: true,
                data: {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    expiresIn: expiresIn,
                },
            };
        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Login failed',
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
