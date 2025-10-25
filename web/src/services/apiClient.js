import axios from 'axios';
import { API_BASE_URL, API_CONFIG, HEADERS } from './config.js';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: HEADERS.JSON,
});

// Token management
class TokenManager {
    constructor() {
        this.accessToken = localStorage.getItem('access_token');
        this.refreshToken = localStorage.getItem('refresh_token');
    }

    setTokens(accessToken, refreshToken) {
        console.log('Setting tokens:', { 
            accessToken: accessToken ? `${accessToken.substring(0, 20)}... (length: ${accessToken.length})` : 'null',
            refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}... (length: ${refreshToken.length})` : 'null'
        });
        
        if (!accessToken) {
            console.warn('Warning: Attempting to set null or empty access token');
            return;
        }

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }
        console.log('Tokens set successfully');
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    getAccessToken() {
        // Always check localStorage in case token was updated elsewhere
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            this.accessToken = storedToken;
        }
        console.log('Getting access token:', this.accessToken ? this.accessToken.substring(0, 20) + '...' : 'null');
        return this.accessToken;
    }

    getRefreshToken() {
        // Always check localStorage in case token was updated elsewhere
        const storedToken = localStorage.getItem('refresh_token');
        if (storedToken) {
            this.refreshToken = storedToken;
        }
        return this.refreshToken;
    }

    isAuthenticated() {
        // Check both instance variable and localStorage
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            this.accessToken = storedToken;
        }
        return !!this.accessToken;
    }
}

const tokenManager = new TokenManager();

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        // Skip auth for login and refresh endpoints
        const skipAuth = config.url?.includes('/auth/login') ||
            config.url?.includes('/auth/refresh') ||
            config.url?.includes('/models');

        if (!skipAuth) {
            const token = tokenManager.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Request details:', {
                    url: config.url,
                    method: config.method,
                    tokenLength: token.length,
                    tokenPrefix: token.substring(0, 20),
                    fullHeader: `Bearer ${token}`
                });
            } else {
                console.warn('No token found for request to:', config.url);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = tokenManager.getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh`,
                        { refresh_token: refreshToken },
                        { headers: HEADERS.JSON }
                    );

                    const { access_token } = response.data;
                    tokenManager.setTokens(access_token, refreshToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, redirect to login
                tokenManager.clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Export token manager for external use
export { tokenManager };

// Export configured axios instance
export default apiClient;
