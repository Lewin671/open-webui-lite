import React from 'react'

const SuggestionItem = ({ title, description }) => {
  return (
    <div className='bg-transparent py-1.5 cursor-pointer rounded-md transition-colors duration-200 hover:bg-primary-light dark:hover:bg-primary-dark'>
      <h5 className='text-sm font-medium mb-0.5 dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1'>{title}</h5>
      <p className='text-xs text-gray-500 font-normal line-clamp-1 m-0'>{description}</p>
    </div>
  )
}

const defaultSuggestions = [
  {
    title: 'Tell me a fun fact',
    description: 'about the Roman Empire'
  },
  {
    title: 'Give me ideas',
    description: 'for what to do with my kids\' art'
  },
  {
    title: 'Grammar check',
    description: 'rewrite it for better readability'
  }
]

const Suggestion = ({ suggestions = defaultSuggestions }) => {
  return (
    <div className='mx-auto max-w-2xl w-full'>
      <div className='mb-1 flex gap-1 text-xs font-medium items-center text-gray-400 dark:text-gray-600'>
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='size-3'>
          <path strokeLinecap='round' strokeLinejoin='round' d='m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z' />
        </svg>
        <span>建议</span>
      </div>
      <div className='flex flex-col gap-2.5'>
        {(suggestions || []).map((suggestion, index) => (
          <SuggestionItem
            key={index}
            title={suggestion.title}
            description={suggestion.description}
          />
        ))}
      </div>
    </div>
  )
}

export default Suggestion