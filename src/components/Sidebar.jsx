import React from 'react';
import {
  TopNavigation,
  WorkspaceButton,
  SearchBox,
  ConversationList,
  UserProfile
} from './sidebar/index';

const Sidebar = () => {
  return (
    <div id="sidebar" className="h-screen max-h-[100dvh] min-h-screen select-none md:relative w-[260px] max-w-[260px] transition-width duration-200 ease-in-out shrink-0 bg-gray-50 text-gray-900 dark:bg-[#0d0d0d] dark:text-gray-200 text-sm fixed z-50 top-0 left-0 overflow-x-hidden">
      <div className="py-2 my-auto flex flex-col justify-between h-screen max-h-[100dvh] w-[260px] overflow-x-hidden z-50">
        <TopNavigation />
        <WorkspaceButton />
        <SearchBox />
        <ConversationList />
        <UserProfile />
      </div>
    </div>
  );
};

export default Sidebar;