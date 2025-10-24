import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Suggestion from './Suggestion';

const MessageArea = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(`${suggestion.title} ${suggestion.description}`);
  };
  return (
    <div className="flex flex-1 w-full justify-center items-center px-20">
      <div className="block overflow-hidden w-full">
        <ChatHeader />
        <Input selectedSuggestion={selectedSuggestion} />
        <Suggestion onSuggestionClick={handleSuggestionClick} />
      </div>
    </div>
  );
};

export default MessageArea;