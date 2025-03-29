import React from 'react';
import Header from './Header';
import ChatView from './ChatView';
import Input from './Input';

const MainContent = () => {
  return (
    <main className="flex-grow flex flex-col h-screen font-sans">
      <Header />
      <div className="flex flex-1 w-full justify-center items-center px-20">
        <div className="block overflow-hidden w-full">
          <ChatView />
          <Input />
        </div>
      </div>
    </main>
  );
};

export default MainContent;