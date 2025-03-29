import React from 'react';
import ChatView from './ChatView';
import Input from './Input';

const ChatContent = () => {
  return (
    <div className="flex flex-1 w-full justify-center items-center px-20">
      <div className="block overflow-hidden w-full">
        <ChatView />
        <Input />
      </div>
    </div>
  );
};

export default ChatContent;