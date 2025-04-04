import React from 'react';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Suggestion from './Suggestion';

const MessageArea = () => {
  return (
    <div className="flex flex-1 w-full justify-center items-center px-20">
      <div className="block overflow-hidden w-full">
        <ChatHeader />
        <Input />
        <Suggestion />
      </div>
    </div>
  );
};

export default MessageArea;