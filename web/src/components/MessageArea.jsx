import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '../contexts/ConversationContext.jsx';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Suggestion from './Suggestion';

const MessageArea = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const { messages, currentConversation, isLoading } = useConversation();
  const messagesEndRef = useRef(null);

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(`${suggestion.title} ${suggestion.description}`);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show suggestions only when no conversation is selected or no messages
  const showSuggestions = !currentConversation || messages.length === 0;

  return (
    <div className="flex flex-1 w-full flex-col">
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-2 rounded-lg ${message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : showSuggestions ? (
          <div className="flex flex-1 w-full justify-center items-center px-20">
            <div className="block overflow-hidden w-full">
              <Input selectedSuggestion={selectedSuggestion} />
              <Suggestion onSuggestionClick={handleSuggestionClick} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>

      {/* Input Area - only show when conversation is selected */}
      {currentConversation && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <Input selectedSuggestion={selectedSuggestion} />
        </div>
      )}
    </div>
  );
};

export default MessageArea;