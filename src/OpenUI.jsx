import React from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

const OpenUI = () => {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <Main />
    </div>
  );
};

export default OpenUI; 