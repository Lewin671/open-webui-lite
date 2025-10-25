import React from 'react'
import { useModel } from '../contexts/ModelContext.jsx'
import ModelSelector from './ModelSelector.jsx'
import DarkModeToggle from './DarkModeToggle.jsx'

const ChatHeader = () => {
  const { selectedModel } = useModel()

  return (
    <section className="w-full flex justify-center py-3"> {/* 新增外层居中容器 */}
      <div className="flex w-fit px-5 flex-row justify-center items-center gap-3 sm:gap-3.5">
        <div className="flex shrink-0 justify-center">
          <div className="flex -space-x-4 mb-0.5">
            <button
              aria-label="OpenUI Logo"
              className="flex transition-opacity hover:opacity-80"
            >
              <img
                src="/favicon.png"
                alt="OpenUI Logo"
                crossOrigin="anonymous"
                className="size-9 sm:size-10 rounded-full border border-gray-100 dark:border-none"
                draggable={false}
              />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl line-clamp-1">{selectedModel?.name || 'Chat Assistant'}</h1>
          <ModelSelector />
          <DarkModeToggle />
        </div>
      </div>
    </section>
  )
}

export default ChatHeader