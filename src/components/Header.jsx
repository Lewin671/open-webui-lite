import React from 'react';

const Header = () => {
  return (
    <nav className="sticky top-0 z-30 w-full px-1.5 py-1.5 -mb-8 flex items-center drag-region" style={{ appRegion: 'drag' }}>
      <div className="bg-linear-to-b via-50% from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent pointer-events-none absolute inset-0 -bottom-7 z-[-1]"></div>
      <div className="flex max-w-full w-full mx-auto px-1 pt-0.5 bg-transparent">
        <div className="flex items-center w-full max-w-full">
          <div className="md:hidden mr-1 self-start flex flex-none items-center text-gray-600 dark:text-gray-400">
            <button className="cursor-pointer px-2 py-2 flex rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition" aria-label="Toggle Sidebar">
              <div className="m-auto self-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
                </svg>
              </div>
            </button>
          </div>
          <div className="flex-1 overflow-hidden max-w-full py-0.5 ml-1">
            <div className="flex flex-col w-full items-start">
              <div className="flex w-full max-w-fit">
                <div className="overflow-hidden w-full">
                  <div className="mr-1 max-w-full">
                    <button className="relative w-full font-primary" aria-label="选择一个模型">
                      <div className="flex w-full text-left px-0.5 outline-hidden bg-transparent truncate text-lg justify-between font-medium placeholder-gray-400 focus:outline-hidden">
                        deepseek-chat
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="self-center ml-2 size-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="self-center mx-1 disabled:text-gray-600 disabled:hover:text-gray-600 -translate-y-[0.5px]">
                  <div aria-label="添加模型" className="flex">
                    <button aria-label="Add Model">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute text-left mt-[1px] ml-1 text-[0.7rem] text-gray-500 font-primary">
              <button>设为默认</button>
            </div>
          </div>
          <div className="self-start flex flex-none items-center text-gray-600 dark:text-gray-400">
            <div aria-label="对话高级设置" className="flex">
              <button className="flex cursor-pointer px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-850 transition" aria-label="Controls">
                <div className="m-auto self-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="currentColor" className="size-5" strokeWidth="0.5">
                    <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div aria-label="新对话" className="flex">
              <button className="flex md:hidden cursor-pointer px-2 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 transition" aria-label="New Chat">
                <div className="m-auto self-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                  </svg>
                </div>
              </button>
            </div>
            <button className="select-none flex rounded-xl p-1.5 w-full hover:bg-gray-50 dark:hover:bg-gray-850 transition" aria-label="User Menu">
              <div className="self-center">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAjhJREFUeF7tmqFOAwEQBbcUQS2GIPoHKBwJioQKFOH78CUoUGiC4A/qMSUoREMx3B0JrgTEXlgyl0x13/bdTF5rOlpd7nbhC0NgpBCMi68iCmH5UAjMh0IUQiMA6+NviEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCYARgdVyIQmAEYHVciEJgBGB1XIhCehAYbcV472gj2Lw8RnRtj2PsyCAWMp6exmR2tUHy/e48muUDm26PdoMQsj2dxc5s/k3IRTTL+x6PzI4oBOZHIQrJE/ArK8+sNKGQUrz54wrJMytNKKQUb/64QvLMShMKKcWbP66QPLPShEJK8eaPKyTPrDShkFK8+eMKyTMrTSikFG/+uELyzEoTCinFmz+ukDyz0oRCSvHmjyskz6w0oZBSvPnjCskzK00opBRv/rhC8sxKEz8Jiegi2o/057avi1jfnKRz/xUY7N+A+gLq1s/xNj/oGy/PKaQcce4DBiFkvH8ck7Pb3JP98u529RTr68M/uVVxZBBCKh6celMhMDMKUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjgtRCIwArI4LUQiMAKyOC1EIjACsjguBCfkEPcW89PtpNFkAAAAASUVORK5CYII=" className="size-6 object-cover rounded-full" alt="User profile" draggable="false" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;