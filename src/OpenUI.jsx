import React from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';

const OpenUI = () => {
  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-main)'
    }}>
      <Sidebar />
      <Main />
    </div>
  );
};

export default OpenUI; 