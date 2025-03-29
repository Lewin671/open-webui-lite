import React from 'react';
import './OpenUI.css';
import Sidebar from './Sidebar';
import Main from './Main';

const OpenUI = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <Main />
    </div>
  );
};

export default OpenUI;