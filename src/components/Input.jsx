import React from 'react'
import './Input.css'

const Input = () => {
  return (
    <div className='text-base font-normal w-full py-3'>
      <div className='w-full font-primary'>
        <div className='mx-auto inset-x-0 bg-transparent flex justify-center'>
          <div className='flex flex-col max-w-3xl w-full px-3'>
            <div className='w-full relative'>
              <form className='w-full flex gap-1.5'>
                {/* 主容器，包含两行 */}
                <div className='flex-1 flex flex-col relative w-full rounded-3xl px-1 bg-gray-600/5 dark:bg-gray-400/5 dark:text-gray-100'>
                  {/* 第一行：输入框区域 */}
                  <div className='px-2.5 pt-3'>
                    <div className='scrollbar-hidden text-left bg-transparent dark:text-gray-100 outline-hidden w-full px-1 resize-none h-fit max-h-80 overflow-auto'>
                      <div className='relative w-full min-w-full h-full min-h-fit input-prose'>
                        <p
                          contentEditable='true'
                          role='textbox'
                          id='chat-input'
                          translate='no'
                          className='outline-none min-h-[24px] empty:before:content-[attr(data-placeholder)] empty:before:text-[#adb5bd] empty:before:pointer-events-none'
                          data-placeholder='有什么我能帮您的吗？'
                        ></p>
                      </div>
                    </div>
                  </div>

                  {/* 第二行：包含所有图标 */}
                  <div className='flex justify-between mt-1.5 mb-2.5 mx-0.5 max-w-full'>
                    {/* 左侧图标：加号 */}
                    <div className='ml-1 self-end gap-0.5 flex items-center flex-1 max-w-[80%]'>
                      <button
                        type='button'
                        className='bg-transparent hover:bg-gray-100 text-gray-800 dark:text-white dark:hover:bg-gray-800 transition rounded-full p-1.5 outline-hidden focus:outline-hidden'
                        aria-label='More'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          className='size-5'
                        >
                          <path d='M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z' />
                        </svg>
                      </button>
                      <div className='flex gap-0.5 items-center overflow-x-auto scrollbar-none flex-1'></div>
                    </div>

                    {/* 右侧图标组 */}
                    <div className='self-end flex space-x-1 mr-1 shrink-0'>
                      {/* 麦克风按钮 */}
                      <div aria-label='录音' className='flex'>
                        <button
                          id='voice-input-button'
                          type='button'
                          className='text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition rounded-full p-1.5 mr-0.5 self-center'
                          aria-label='Voice Input'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            className='w-5 h-5 translate-y-[0.5px]'
                          >
                            <path d='M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z' />
                            <path d='M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z' />
                          </svg>
                        </button>
                      </div>

                      {/* 呼叫按钮 */}
                      <div className='flex items-center'>
                        <div aria-label='呼叫' className='flex'>
                          <button
                            type='button'
                            className='bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition rounded-full p-1.5 self-center'
                            aria-label='Call'
                          >
                            <svg
                              aria-hidden='true'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                              strokeWidth='0'
                              stroke='currentColor'
                              className='size-5'
                            >
                              <path
                                fillRule='evenodd'
                                d='M12 5a7 7 0 0 0-7 7v1.17c.313-.11.65-.17 1-.17h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3v-6a9 9 0 0 1 18 0v6a3 3 0 0 1-3 3h-2a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2c.35 0 .687.06 1 .17V12a7 7 0 0 0-7-7Z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
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
  )
}

export default Input
