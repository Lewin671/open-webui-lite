import React from 'react'
import Sidebar from './Sidebar'
import Main from './Main'

const OpenUI = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#212121]">
      <Sidebar />
      <Main />
    </div>
  )
}

export default OpenUI
