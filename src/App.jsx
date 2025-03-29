import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import Input from './components/Input';
import './App.css';

function App() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-primary">
      <Sidebar />
      <main className="flex-grow flex flex-col h-screen font-sans">
        <Header />
        <div className="flex flex-1 w-full justify-center items-center px-20">
          <div className="block overflow-hidden w-full">
            <ChatView />
            <Input />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
