import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload.error,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const result = await authService.getUserInfo();
                    if (result.success) {
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: { user: result.data },
                        });
                    } else {
                        dispatch({ type: 'LOGOUT' });
                    }
                } catch (error) {
                    dispatch({ type: 'LOGOUT' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const result = await authService.login(email, password);
            console.log('Login result:', result);  // Add debug log

            if (!result.success) {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: { error: result.error },
                });
                return;
            }

            if (!result.data?.accessToken) {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: { error: 'No access token received from server' },
                });
                return;
            }

            // Get user info after successful login
            const userResult = await authService.getUserInfo();
            console.log('User info result:', userResult);  // Add debug log

            if (userResult.success) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: userResult.data },
                });
            } else {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: { error: userResult.error },
                });
            }
        } catch (error) {
            console.error('Login error:', error);  // Add debug log
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: { error: error.message || 'An unexpected error occurred' },
            });
        }
    };

    const logout = () => {
        authService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
