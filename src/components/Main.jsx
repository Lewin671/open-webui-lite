import React from 'react';
import './styles/Main.css';
import Header from './Header';
import ChatView from './ChatView';
import Input from './Input';

const Main = () => {
  return (
    <main className="main-panel">
      <Header />
      <ChatView />
      <Input />
      <button className="help-button">?</button>
    </main>
  );
};

export default Main;