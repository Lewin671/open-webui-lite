import React, { createContext, useContext, useReducer, useEffect } from 'react';
import conversationService from '../services/conversationService.js';
import messageService from '../services/messageService.js';

const ConversationContext = createContext();

const initialState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,
};

function conversationReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_CONVERSATIONS':
            return {
                ...state,
                conversations: action.payload,
                isLoading: false,
                error: null,
            };
        case 'SET_CURRENT_CONVERSATION':
            return {
                ...state,
                currentConversation: action.payload,
                isLoading: false,
                error: null,
            };
        case 'SET_MESSAGES':
            return {
                ...state,
                messages: action.payload,
                isLoading: false,
                error: null,
            };
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'UPDATE_MESSAGE':
            return {
                ...state,
                messages: state.messages.map(msg =>
                    msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
                ),
            };
        case 'ADD_CONVERSATION':
            return {
                ...state,
                conversations: [action.payload, ...state.conversations],
            };
        case 'UPDATE_CONVERSATION':
            return {
                ...state,
                conversations: state.conversations.map(conv =>
                    conv.id === action.payload.id ? { ...conv, ...action.payload.updates } : conv
                ),
                currentConversation: state.currentConversation?.id === action.payload.id
                    ? { ...state.currentConversation, ...action.payload.updates }
                    : state.currentConversation,
            };
        case 'DELETE_CONVERSATION':
            return {
                ...state,
                conversations: state.conversations.filter(conv => conv.id !== action.payload),
                currentConversation: state.currentConversation?.id === action.payload
                    ? null
                    : state.currentConversation,
                messages: state.currentConversation?.id === action.payload
                    ? []
                    : state.messages,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
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

export function ConversationProvider({ children }) {
    const [state, dispatch] = useReducer(conversationReducer, initialState);

    const loadConversations = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });

        const result = await conversationService.getConversations();

        if (result.success) {
            dispatch({ type: 'SET_CONVERSATIONS', payload: result.data });
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
        }
    };

    const loadConversation = async (conversationId) => {
        dispatch({ type: 'SET_LOADING', payload: true });

        const result = await conversationService.getConversation(conversationId);

        if (result.success) {
            dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: result.data });

            // Load messages for this conversation
            await loadMessages(conversationId);
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
        }
    };

    const loadMessages = async (conversationId) => {
        const result = await messageService.getMessages(conversationId);

        if (result.success) {
            dispatch({ type: 'SET_MESSAGES', payload: result.data });
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
        }
    };

    const createConversation = async (title, metadata = {}) => {
        const result = await conversationService.createConversation(title, metadata);

        if (result.success) {
            dispatch({ type: 'ADD_CONVERSATION', payload: result.data });
            return result.data;
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
            return null;
        }
    };

    const updateConversation = async (conversationId, updates) => {
        const result = await conversationService.updateConversation(conversationId, updates);

        if (result.success) {
            dispatch({ type: 'UPDATE_CONVERSATION', payload: { id: conversationId, updates: result.data } });
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
        }
    };

    const deleteConversation = async (conversationId) => {
        const result = await conversationService.deleteConversation(conversationId);

        if (result.success) {
            dispatch({ type: 'DELETE_CONVERSATION', payload: conversationId });
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
        }
    };

    const addMessage = (message) => {
        dispatch({ type: 'ADD_MESSAGE', payload: message });
    };

    const updateMessage = (messageId, updates) => {
        dispatch({ type: 'UPDATE_MESSAGE', payload: { id: messageId, updates } });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        loadConversations,
        loadConversation,
        loadMessages,
        createConversation,
        updateConversation,
        deleteConversation,
        addMessage,
        updateMessage,
        clearError,
    };

    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversation() {
    const context = useContext(ConversationContext);
    if (context === undefined) {
        throw new Error('useConversation must be used within a ConversationProvider');
    }
    return context;
}
