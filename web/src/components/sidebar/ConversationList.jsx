import React, { useEffect } from 'react'
import { useConversation } from '../../contexts/ConversationContext.jsx'

const ConversationList = () => {
  const {
    conversations,
    currentConversation,
    isLoading,
    error,
    loadConversations,
    loadConversation,
    createConversation,
    deleteConversation,
    clearError
  } = useConversation()


  useEffect(() => {
    loadConversations()
  }, [])


  const handleConversationClick = (conversationId) => {
    loadConversation(conversationId)
  }

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(conversationId)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  if (error) {
    return (
      <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
        <div className='relative px-2 mt-0.5'>
          <div className='text-red-500 text-sm p-2'>
            Error: {error}
            <button
              onClick={clearError}
              className='ml-2 text-xs underline'
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
      <div className='relative px-2 mt-0.5'>
        <div className='w-full'>

          {/* Conversations List */}
          {isLoading ? (
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto'></div>
            </div>
          ) : (
            (conversations || []).map((conversation) => (
              <div key={conversation.id} className='w-full cursor-pointer mb-1'>
                <div>
                  <div
                    className={`w-full group rounded-md relative flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-900 text-tip transition ${currentConversation?.id === conversation.id
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                      }`}
                    onClick={() => handleConversationClick(conversation.id)}
                  >
                    <div className='w-full py-1.5 pl-2 flex items-center gap-1.5 text-xs font-medium cursor-pointer'>
                      <div className='text-[#676767]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth='2.5'
                          stroke='currentColor'
                          className='size-3'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m8.25 4.5 7.5 7.5-7.5 7.5'
                          ></path>
                        </svg>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='truncate'>{conversation.title}</div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          {formatDate(conversation.updated_at)}
                        </div>
                      </div>
                    </div>
                    <div className='absolute z-10 right-2 invisible group-hover:visible self-center flex items-center dark:text-gray-300'>
                      <div aria-label='Delete conversation' className='flex'>
                        <div
                          className='p-0.5 dark:hover:bg-gray-850 rounded-lg touch-auto cursor-pointer'
                          onClick={(e) => handleDeleteConversation(conversation.id, e)}
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='2.5'
                            stroke='currentColor'
                            className='size-3 text-red-500'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationList
