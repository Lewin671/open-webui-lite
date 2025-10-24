import React from 'react'
import Sidebar from './components/Sidebar'
import ChatContainer from './components/ChatContainer'
import './App.css'

function App () {
  return (
    <div className='flex w-full h-screen overflow-hidden text-black dark:text-gray-100 bg-primary-light dark:bg-primary-dark'>
      <Sidebar />
      <ChatContainer />
    </div>
  )
}

export default App
