import React, { useEffect, useState } from 'react'

const SuggestionCard = ({ title, description }) => {
  return (
    <div className='bg-[#2a2a2a] p-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 border border-[#383838] flex items-start hover:bg-[#333333]'>
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-4 h-4 mr-2.5  flex-shrink-0 mt-0.5'
      >
        <path
          d='M10 19L12 13H9L14 5L12 11H15L10 19Z'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      <div className='flex flex-col'>
        <h5 className='text-sm font-medium mb-0.5 leading-snug'>{title}</h5>
        <p className='text-xs  leading-relaxed m-0'>{description}</p>
      </div>
    </div>
  )
}

const ChatView = () => {
  return (
    <section className='overflow-hidden flex flex-col items-center justify-center w-full'>
      <div className='text-center flex flex-row items-center justify-center gap-5'>
        <div className='w-10 h-10 flex items-center justify-center rounded-full shadow-sm overflow-hidden'>
          <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 overflow-hidden'>
            <img
              src='/favicon.png'
              alt='OpenUI Logo'
              className='w-full h-full object-cover bg-white'
            />
          </div>
        </div>
        <div className='text-3xl @sm:text-4xl line-clamp-1'>deepseek-chat</div>
      </div>

      <div className='w-full max-w-[768px] mx-auto flex flex-col items-center'>
        {/* Removing the suggestion cards from the main view */}
        {/* <h4 className="text-sm font-medium  mb-4 flex items-center">建议</h4> */}
        {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 w-full"> ... cards removed ... </div> */}
      </div>
    </section>
  )
}

export default ChatView
