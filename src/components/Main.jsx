import React from 'react';
// import Header from './Header';
import ChatView from './ChatView';
import Input from './Input';

const Main = () => {
  return (
    <main className="main-content">
      {/* Remove Header component */}
      {/* <Header /> */}
      <ChatView />
      <Input />
    </main>
  );
};

export default Main;