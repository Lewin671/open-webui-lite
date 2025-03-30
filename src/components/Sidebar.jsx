import React from 'react';

const Sidebar = () => {
  return (
    <div id="sidebar" className="h-screen max-h-[100dvh] min-h-screen select-none md:relative w-[260px] max-w-[260px] transition-width duration-200 ease-in-out shrink-0 bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-200 text-sm fixed z-50 top-0 left-0 overflow-x-hidden">
      <div className="py-2 my-auto flex flex-col justify-between h-screen max-h-[100dvh] w-[260px] overflow-x-hidden z-50">
        
        {/* 顶部导航栏 */}
        <div className="px-1.5 flex justify-between space-x-1 text-gray-600 dark:text-gray-400">
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
        
        {/* 工作空间按钮 */}
        <div className="px-1.5 flex justify-center text-gray-800 dark:text-gray-200">
          <a className="grow flex items-center space-x-3 rounded-lg px-2 py-[7px] hover:bg-gray-100 dark:hover:bg-gray-900 transition" href="/workspace" draggable="false">
            <div className="self-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-[1.1rem]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"></path>
              </svg>
            </div>
            <div className="flex self-center translate-y-[0.5px]">
              <div className="self-center font-medium text-sm font-primary">工作空间</div>
            </div>
          </a>
        </div>
        
        {/* 搜索框 */}
        <div className="relative">
          <div className="px-1 mb-1 flex justify-center space-x-2 relative z-10" id="search-container">
            <div className="flex w-full rounded-xl" id="chat-search">
              <div className="self-center pl-3 py-2 rounded-l-xl bg-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <input className="w-full rounded-r-xl py-1.5 pl-2.5 pr-4 text-sm bg-transparent dark:text-gray-300 outline-hidden" placeholder="搜索" />
            </div>
          </div>
        </div>
        
        {/* 对话列表区域 */}
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="relative px-2 mt-0.5">
            <div className="w-full">
              <div className="w-full cursor-pointer">
                <div>
                  <div className="w-full group rounded-md relative flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-500 transition">
                    <button className="w-full py-1.5 pl-2 flex items-center gap-1.5 text-xs font-medium">
                      <div className="text-gray-300 dark:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                        </svg>
                      </div>
                      <div className="translate-y-[0.5px]">对话</div>
                    </button>
                    <button className="absolute z-10 right-2 invisible group-hover:visible self-center flex items-center dark:text-gray-300">
                      <div aria-label="新文件夹" className="flex">
                        <button className="p-0.5 dark:hover:bg-gray-850 rounded-lg touch-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                          </svg>
                        </button>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 用户信息 */}
        <div className="px-2">
          <div className="flex flex-col font-primary">
            <button aria-controls="52FPl8QKIS" aria-expanded="false" data-state="closed" id="g7XpxqxmfH" tabIndex="0" data-melt-dropdown-menu-trigger="" data-menu-trigger="" type="button">
              <button className="flex items-center rounded-xl py-2.5 px-2.5 w-full hover:bg-gray-100 dark:hover:bg-gray-900 transition">
                <div className="self-center mr-3">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAjhJREFUeF7tmqFOAwEQBbcUQS2GIPoHKBwJioQKFOH78CUoUGiC4A/qMSUoREMx3B0JrgTEXlgyl0x13/bdTF5rOlpd7nbhC0NgpBCMi68iCmH5UAjMh0IUQiMA6+NviEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCehAYbcV472gj2Lw8RnRtj2PsyCAWMp6exmR2tUHy/e48muUDm26PdoMQsj2dxc5s/k3IRTTL+x6PzI4oBOZHIQrJE/ArK8+sNKGQUrz54wrJMytNKKQUb/64QvLMShMKKcWbP66QPLPShEJK8eaPKyTPrDShkFK8+eMKyTMrTSikFG/+uELyzEoTCinFmz+ukDyz0oRCSvHmjyskz6w0oZBSvPnjCskzK00opBRv/rhC8sxKEz8Ziegi2o/057avi1jfnKRz/xUY7N+A+gLq1s/xNj/oGy/PKaQcce4DBiFkvH8ck7Pb3JP98u529RTr68M/uVVxZBBCKh6celMhMDMKUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjguBCfkEPcW89PtpNFkAAAAASUVORK5CYII=" className="max-w-[30px] object-cover rounded-full" alt="User profile" />
                </div>
                <div className="self-center font-medium">liu</div>
              </button>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;