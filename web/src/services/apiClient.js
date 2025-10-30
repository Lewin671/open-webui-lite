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
        if (!accessToken) return;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('access_token', accessToken);
        if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    getAccessToken() {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) this.accessToken = storedToken;
        return this.accessToken;
    }

    getRefreshToken() {
        const storedToken = localStorage.getItem('refresh_token');
        if (storedToken) this.refreshToken = storedToken;
        return this.refreshToken;
    }

    isAuthenticated() {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) this.accessToken = storedToken;
        return !!this.accessToken;
    }
}

const tokenManager = new TokenManager();

// Normalize API errors
export function toApiError(error) {
    const status = error?.response?.status;
    const data = error?.response?.data || {};
    return {
        status: status || 0,
        code: data.code || 'REQUEST_FAILED',
        message: data.error || error?.message || 'Request failed',
        details: data.details || null,
    };
}

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const skipAuth = config.url?.includes('/auth/login') ||
            config.url?.includes('/auth/refresh') ||
            config.url?.includes('/models');

        if (!skipAuth) {
            const token = tokenManager.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
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
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                tokenManager.clearTokens();
                window.location.href = '/login';
                return Promise.reject(toApiError(refreshError));
            }
        }
        return Promise.reject(toApiError(error));
    }
);

// Export token manager for external use
export { tokenManager };

// Export configured axios instance
export default apiClient;
