import React from 'react'

const ChatHeader = () => {
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
    </section>
  )
}

export default ChatHeader
