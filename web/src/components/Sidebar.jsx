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
  const { isCollapsed } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => {/* handled by context */ }}
        />
      )}

      <div
        id="sidebar"
        className={`h-screen max-h-[100dvh] min-h-screen select-none transition-all duration-300 ease-in-out shrink-0 bg-gray-50 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200 text-sm fixed z-50 top-0 left-0 overflow-x-hidden ${isCollapsed
            ? 'w-0 max-w-0 md:w-[260px] md:max-w-[260px]'
            : 'w-[260px] max-w-[260px]'
          }`}
      >
        <div className={`py-2 my-auto flex flex-col justify-between h-screen max-h-[100dvh] overflow-x-hidden z-50 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 md:w-[260px] md:opacity-100' : 'w-[260px] opacity-100'
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