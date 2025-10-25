import React from 'react';
import { useSidebar } from '../contexts/SidebarContext.jsx';
import {
  TopNavigation,
  WorkspaceButton,
  SearchBox,
  ConversationList,
  UserProfile
} from './sidebar/index';

const Sidebar = () => {
  const { isCollapsed, collapseSidebar, toggleSidebar } = useSidebar();

  // Debug logging
  console.log('Sidebar render - isCollapsed:', isCollapsed);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={collapseSidebar}
        />
      )}

      {/* 汉堡菜单按钮 - 始终可见 */}
      <button
        onClick={toggleSidebar}
        className="fixed top-2 left-2 z-50 cursor-pointer p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition bg-gray-50 dark:bg-[#0d0d0d] shadow-lg"
        aria-label="Toggle Sidebar"
      >
        <div className="m-auto self-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
          </svg>
        </div>
      </button>

      <div
        id="sidebar"
        className={`h-screen max-h-[100dvh] min-h-screen select-none transition-all duration-300 ease-in-out shrink-0 bg-gray-50 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200 text-sm fixed z-40 top-0 left-0 overflow-x-hidden ${isCollapsed
          ? 'w-12 max-w-12'
          : 'w-[260px] max-w-[260px]'
          }`}
      >
        <div className={`py-2 my-auto flex flex-col justify-between h-screen max-h-[100dvh] overflow-x-hidden z-50 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-[260px] opacity-100'
          }`}>
          <TopNavigation />
          <WorkspaceButton />
          <SearchBox />
          <ConversationList />
          <UserProfile />
        </div>
      </div>
    </>
  );
};

export default Sidebar;