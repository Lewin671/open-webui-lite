import React from 'react';

const SuggestionItem = ({ title, description }) => {
  return (
    <button className="flex flex-col w-full justify-between px-3 py-2 rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition group text-left">
      <div className="flex flex-col">
        <div className="font-medium text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1">
          {title}
        </div>
        <div className="text-xs text-gray-500 font-normal line-clamp-1">
          {description}
        </div>
      </div>
    </button>
  );
};

const defaultSuggestions = [
    {
        title: 'Help me study',
        description: 'vocabulary for a college entrance exam'
    },
    {
        title: 'Grammar check',
        description: 'rewrite it for better readability'
    },
    {
        title: 'Show me a code snippet',
        description: "of a website's sticky header"
    },
    {
        title: 'Give me ideas',
        description: "for what to do with my kids' art"
    },
    {
        title: 'Tell me a fun fact',
        description: 'about the Roman Empire'
    },
    {
        title: 'Explain options trading',
        description: "if I'm familiar with buying and selling stocks"
    },
    {
        title: 'Overcome procrastination',
        description: 'give me tips'
    }
];


const Suggestion = ({ suggestions = defaultSuggestions }) => {
  return (
    <div className="mx-auto max-w-2xl w-full font-primary">
      <div className="mx-5">
        <div className="mb-1 flex gap-1 text-xs font-medium items-center text-gray-400 dark:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
            />
          </svg>
          <span>建议</span>
        </div>
        {/* 修改滚动容器样式 */}
        <div className="h-40 overflow-y-auto scrollbar-none flex flex-col gap-1 pb-1 no-scrollbar">
          {(suggestions || []).map((suggestion, index) => (
            <SuggestionItem
              key={index}
              title={suggestion.title}
              description={suggestion.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;