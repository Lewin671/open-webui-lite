import React from 'react'
import Sidebar from './components/Sidebar'
import ChatContainer from './components/ChatContainer'
import './App.css'

function App () {
  return (
    <div className='flex w-full h-screen overflow-hidden bg-primary'>
      <Sidebar />
      <ChatContainer />
    </div>
  )
}

export default App
