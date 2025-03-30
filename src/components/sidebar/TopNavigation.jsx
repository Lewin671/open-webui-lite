import React from 'react';

const TopNavigation = () => {
  return (
    <div className="px-1.5 flex justify-between space-x-1 text-[#b4b4b4]">
      {/* 菜单按钮 */}
      <button className="cursor-pointer p-[7px] flex rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition">
        <div className="m-auto self-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
          </svg>
        </div>
      </button>
      
      {/* 新对话按钮 */}
      <a id="sidebar-new-chat-button" className="flex justify-between items-center flex-1 rounded-lg px-2 py-1 h-full text-right hover:bg-gray-100 dark:hover:bg-gray-900 transition no-drag-region" href="/" draggable="false">
        <div className="flex items-center">
          <div className="self-center mx-1.5">
            <img crossOrigin="anonymous" src="/favicon.png" className="size-5 -translate-x-1.5 rounded-full" alt="logo" />
          </div>
          <div className="self-center font-medium text-sm text-gray-850 dark:text-white font-primary">新对话</div>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
          </svg>
        </div>
      </a>
    </div>
  );
};

export default TopNavigation;