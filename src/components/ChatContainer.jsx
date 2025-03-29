import React from 'react';
import Header from './Header';
import MessageArea from './MessageArea';

const MainContent = () => {
  return (
    <main className="flex-grow flex flex-col h-screen font-sans">
      <Header />
      <MessageArea />
    </main>
  );
};

export default MainContent;