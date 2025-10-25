import React, { useState, useEffect, useRef } from 'react'
import { useConversation } from '../contexts/ConversationContext.jsx'
import { useModel } from '../contexts/ModelContext.jsx'
import messageService from '../services/messageService.js'
import './Input.css'

const Input = ({ selectedSuggestion }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const inputRef = useRef(null);

  const {
    currentConversation,
    addMessage,
    updateMessage,
    loadConversations
  } = useConversation();

  const { selectedModel } = useModel();

  useEffect(() => {
    if (selectedSuggestion && inputRef.current) {
      setInputText(selectedSuggestion);
      inputRef.current.innerText = selectedSuggestion;
      // Focus and move cursor to the end
      inputRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      if (sel) {
        range.selectNodeContents(inputRef.current);
        range.collapse(false); // false to collapse to the end
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [selectedSuggestion]);

  const handleInputChange = (event) => {
    if (event.target && typeof event.target.innerText === 'string') {
      setInputText(event.target.innerText);
    } else if (typeof event === 'string') {
      setInputText(event);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim() || !currentConversation || isLoading) {
      return;
    }

    const userMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      created_at: new Date().toISOString(),
    };

    // Add user message immediately
    addMessage(userMessage);

    // Clear input
    setInputText('');
    if (inputRef.current) {
      inputRef.current.innerText = '';
    }

    setIsLoading(true);

    try {
      // Create assistant message placeholder for streaming
      const assistantMessageId = `temp-assistant-${Date.now()}`;
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      };

      addMessage(assistantMessage);
      setStreamingMessage(assistantMessage);

      // Send message with streaming
      await messageService.sendMessageStream(
        currentConversation.id,
        {
          role: 'user',
          content: userMessage.content,
          model: selectedModel?.id || 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1000,
        },
        (delta) => {
          // Update streaming message content
          const updatedContent = (assistantMessage.content || '') + delta.delta;
          updateMessage(assistantMessageId, { content: updatedContent });
          setStreamingMessage(prev => ({ ...prev, content: updatedContent }));
        },
        (finalMessage) => {
          // Final message received
          updateMessage(assistantMessageId, {
            id: finalMessage.message.id,
            content: finalMessage.message.content,
            created_at: finalMessage.message.created_at,
          });
          setStreamingMessage(null);
          setIsLoading(false);

          // Refresh conversations to update the list
          loadConversations();
        },
        (error) => {
          console.error('Streaming error:', error);
          updateMessage(assistantMessageId, {
            content: 'Sorry, there was an error generating the response.',
          });
          setStreamingMessage(null);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      setStreamingMessage(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
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
                          ref={inputRef}
                          contentEditable='true'
                          role='textbox'
                          id='chat-input'
                          translate='no'
                          className='outline-none min-h-[24px] empty:before:content-[attr(data-placeholder)] empty:before:text-[#adb5bd] empty:before:pointer-events-none'
                          data-placeholder='有什么我能帮您的吗？'
                          onInput={handleInputChange}
                          onKeyDown={handleKeyDown}
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

                      {/* 发送按钮 */}
                      <div className='flex items-center'>
                        <div aria-label='发送' className='flex'>
                          <button
                            type='button'
                            onClick={handleSubmit}
                            disabled={!inputText.trim() || isLoading}
                            className={`transition rounded-full p-1.5 self-center ${inputText.trim() && !isLoading ? 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100' : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
                            aria-label='Send'
                          >
                            {isLoading ? (
                              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-current'></div>
                            ) : (
                              <svg
                                aria-hidden='true'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='currentColor'
                                viewBox='0 0 24 24'
                                strokeWidth='0'
                                stroke='currentColor'
                                className='size-5'
                              >
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                              </svg>
                            )}
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
