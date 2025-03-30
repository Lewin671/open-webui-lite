import React from 'react';

const ConversationList = () => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <div className="relative px-2 mt-0.5">
        <div className="w-full">
          <div className="w-full cursor-pointer">
            <div>
              <div className="w-full group rounded-md relative flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-500 transition">
                <div className="w-full py-1.5 pl-2 flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                  <div className="text-gray-300 dark:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                    </svg>
                  </div>
                  <div className="translate-y-[0.5px]">对话</div>
                </div>
                <div className="absolute z-10 right-2 invisible group-hover:visible self-center flex items-center dark:text-gray-300">
                  <div aria-label="新文件夹" className="flex">
                    <div className="p-0.5 dark:hover:bg-gray-850 rounded-lg touch-auto cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;