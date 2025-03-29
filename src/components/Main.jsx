import React from 'react';
import Header from './Header';
import ChatView from './ChatView';
import Input from './Input';

const Main = () => {
  return (
    <main className="main-content">
      <Header />
      <div className='main-body'>
        <div className='chat-container'>
          <ChatView />
          <Input />
        </div>
      </div>
    </main>
  );
};

export default Main;