import React from 'react';
import Sidebar from './Sidebar';
import Main from './Main';

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