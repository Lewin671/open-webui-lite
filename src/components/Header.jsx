import React from 'react';

const Header = () => {
  return (
    <header className="h-[60px] flex items-center justify-between sticky top-0 bg-[#212121] z-10 px-6 text-[#e0e0e0]">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-base font-semibold flex items-center whitespace-nowrap m-0">
            deepseek-chat
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1.5 opacity-80 text-[#a0a0a0]">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </h1>
          <span className="text-xs text-[#a0a0a0] mt-0.5">设为默认</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center text-[#a0a0a0] p-1 rounded hover:bg-[#2a2a2a] hover:text-[#e0e0e0]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-[#f5a623] text-[#171717] flex items-center justify-center font-bold text-sm flex-shrink-0">L</div>
      </div>
    </header>
  );
};

export default Header;