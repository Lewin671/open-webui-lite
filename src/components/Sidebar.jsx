import React from 'react';
import './styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn">
          <span className="icon logo-icon">OI</span>
          New Chat
          <span className="icon edit-icon">✎</span>
          <span className="icon menu-icon">≡</span>
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#"><span className="icon">⌘</span> Workspace</a></li>
          <li><a href="#"><span className="icon">🔍</span> Search</a></li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <span className="avatar">TB</span>
          <span className="user-name">Timothy J. Baek</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;