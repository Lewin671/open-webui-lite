import React from 'react';

const Input = () => {
  return (
    <div className="text-base font-normal w-full py-6">
      <div className="w-full font-primary">
        <div className="mx-auto inset-x-0 bg-transparent flex justify-center">
          <div className="flex flex-col max-w-3xl w-full px-3">
            <div className="w-full relative">
              <form className="w-full flex gap-1.5">
                {/* 主容器，包含两行 */}
                <div className="flex-1 flex flex-col relative w-full rounded-3xl px-1 bg-gray-600/5 dark:bg-gray-400/5 dark:text-gray-100">

                  {/* 第一行：只有输入框 */}
                  {/* 调整了内边距 pl-3 pr-1.5 pt-1.5 */}
                  <div className="flex items-center w-full pl-3 pr-1.5 pt-1.5">
                    <input
                      type="text"
                      placeholder="有什么我能帮您的吗?"
                      // 移除了 mx-2, 调整了 py
                      className="flex-grow bg-transparent border-none outline-none text-[15px] px-1 py-1 min-h-6 dark:text-gray-100 text-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>

                  {/* 第二行：包含所有图标 */}
                  {/* 使用 justify-between 将左右图标分开 */}
                  {/* 调整了内边距 px-1.5 pb-1.5 pt-1 */}
                  <div className="flex justify-between items-center px-1.5 pb-1.5 pt-1">
                    {/* 左侧图标：加号 */}
                    <button
                      type="button"
                      // 移除了 ml-1.5
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19M5 12H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* 右侧图标组 */}
                    <div className="flex items-center space-x-1.5">
                      {/* 麦克风按钮 */}
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg
                          className="size-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
                        </svg>
                      </button>

                      {/* 另一个按钮 */}
                      <button
                        type="button"
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                      >
                        <svg
                          className="size-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M1 12a11 11 0 0 1 22 0"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12v4a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3zm18 0v4a3 3 0 0 1-3 3h-1a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a3 3 0 0 1 3 3z"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {/* 如果需要发送按钮，可以放在这里 */}
                      {/* <button type="submit" className="p-2 ...">发送</button> */}
                    </div>
                  </div>
                </div>
                {/* 如果有独立的发送按钮，可以放在 form 的 flex gap 中 */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;