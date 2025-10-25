import React from 'react';
import { useSidebar } from '../contexts/SidebarContext.jsx';
import Header from './Header';
import MessageArea from './MessageArea';

const MainContent = () => {
  const { isCollapsed } = useSidebar();

  return (
    <main className={`flex-grow flex flex-col h-screen font-sans transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-12' : 'md:ml-[260px]'
      }`}>
      <Header />
      <MessageArea />
    </main>
  );
};

export default MainContent;