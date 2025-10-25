import React, { createContext, useContext, useReducer, useEffect } from 'react';
import modelService from '../services/modelService.js';

const ModelContext = createContext();

const initialState = {
    models: [],
    selectedModel: null,
    isLoading: false,
    error: null,
};

function modelReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_MODELS':
            return {
                ...state,
                models: action.payload,
                isLoading: false,
                error: null,
            };
        case 'SET_SELECTED_MODEL':
            return {
                ...state,
                selectedModel: action.payload,
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

export function ModelProvider({ children }) {
    const [state, dispatch] = useReducer(modelReducer, initialState);

    const loadModels = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });

        const result = await modelService.getModels();

        if (result.success) {
            dispatch({ type: 'SET_MODELS', payload: result.data });

            // Set default model if none selected
            if (!state.selectedModel && result.data.length > 0) {
                dispatch({ type: 'SET_SELECTED_MODEL', payload: result.data[0] });
            }
        } else {
            dispatch({ type: 'SET_ERROR', payload: result.error });
        }
    };

    const selectModel = (model) => {
        dispatch({ type: 'SET_SELECTED_MODEL', payload: model });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    // Load models on mount
    useEffect(() => {
        loadModels();
    }, []);

    const value = {
        ...state,
        loadModels,
        selectModel,
        clearError,
    };

    return (
        <ModelContext.Provider value={value}>
            {children}
        </ModelContext.Provider>
    );
}

export function useModel() {
    const context = useContext(ModelContext);
    if (context === undefined) {
        throw new Error('useModel must be used within a ModelProvider');
    }
    return context;
}
