import React from 'react'
import Sidebar from './Sidebar'
import Main from './Main'

const OpenUI = () => {
  return (
    <div className='flex w-full h-screen overflow-hidden bg-white dark:bg-black'>
      <Sidebar />
      <Main />
    </div>
  )
}

export default OpenUI
