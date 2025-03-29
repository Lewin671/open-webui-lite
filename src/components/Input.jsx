import React from 'react'

// Simple component for suggestion items below input
const SuggestionItem = ({ title, description }) => {
  return (
    <div className='bg-transparent py-1.5 cursor-pointer rounded-md transition-colors duration-200 hover:bg-primary-light dark:hover:bg-primary-dark'>
      <h5 className='text-sm font-medium mb-0.5 '>{title}</h5>
      <p className='text-xs  leading-relaxed m-0'>{description}</p>
    </div>
  )
}

const Input = () => {
  // Example suggestions data
  const suggestions = [
    {
      title: 'Grammar check',
      description: 'rewrite it for better readability'
    },
    {
      title: 'Explain options trading',
      description: "if I'm familiar with buying and selling stocks"
    },
    {
      title: 'Show me a code snippet',
      description: "of a website's sticky header"
    }
  ]

  return (
    <div className='flex flex-col w-full items-center'>
      <div className='flex flex-col w-full max-w-[768px] items-center'>
        {/* Main input bar */}
        <div className='block w-full py-3'>
          <div className='flex items-center bg-[#ecececcc] dark:bg-[#2a2a2acc] border border-primary-light dark:border-[#2a2a2acc] rounded-full w-full min-h-[52px]'>
            <button className=' flex items-center justify-center p-2 rounded-full hover:bg-[#383838] hover: mr-1.5'>
              {/* '+' Icon SVG */}
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 5V19M5 12H19'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            <input
              type='text'
              placeholder='有什么我能帮您的吗?'
              className='flex-grow bg-transparent border-none outline-none text-[15px] py-2.5 px-3 mx-2 min-h-6 dark:text-[#ececec] text-[#333]'
            />

            <button className=' flex items-center justify-center p-2 rounded-full hover:bg-[#383838] hover: ml-1.5'>
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'
                  fill='currentColor'
                />
                <path
                  d='M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z'
                  fill='currentColor'
                />
              </svg>
            </button>
            <button className=' flex items-center justify-center p-2 rounded-full hover:bg-[#383838] hover: ml-1.5'>
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M1 12a11 11 0 0 1 22 0'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M2 12v4a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3zm18 0v4a3 3 0 0 1-3 3h-1a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a3 3 0 0 1 3 3z'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Section Below Input */}
      <div className='mx-5 max-w-[42rem] w-full'>
        <div className='flex items-center gap-1.5 text-sm font-medium  mb-3'>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='w-3.5 h-3.5 opacity-70'
          >
            <path
              d='M10 19L12 13H9L14 5L12 11H15L10 19Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>建议</span>
        </div>
        <div className='flex flex-col gap-2.5'>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              title={suggestion.title}
              description={suggestion.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Input
