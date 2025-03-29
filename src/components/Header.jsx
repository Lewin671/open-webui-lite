import React from 'react';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-left">
        <div className="header-title-container">
          <h1 className="header-title">
            deepseek-chat
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-dropdown-arrow">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </h1>
          <span className="header-subtitle">设为默认</span>
        </div>
      </div>
      <div className="header-right">
        <button className="header-icon-button">
          {/* Placeholder for List/Settings Icon - Replace with actual SVG or image */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
        <div className="header-avatar">L</div>
      </div>
    </header>
  );
};

export default Header;