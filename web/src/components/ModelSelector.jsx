import React, { useState } from 'react';
import { useModel } from '../contexts/ModelContext.jsx';

const ModelSelector = () => {
    const { models, selectedModel, selectModel, isLoading } = useModel();
    const [isOpen, setIsOpen] = useState(false);

    const handleModelSelect = (model) => {
        selectModel(model);
        setIsOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="text-sm text-gray-500">Loading models...</span>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <span className="font-medium">
                    {selectedModel?.name || 'Select Model'}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                        {models.length > 0 ? (
                            models.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => handleModelSelect(model)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${selectedModel?.id === model.id
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                >
                                    <div className="font-medium">{model.name}</div>
                                    {model.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {model.description}
                                        </div>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No models available
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default ModelSelector;
