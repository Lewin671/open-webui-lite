import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/splash.png" alt="Logo" className="sidebar-logo" />
        <span className="sidebar-title">新对话</span>
        <button className="sidebar-edit-button">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M13.293 3.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9A1 1 0 0 1 6.586 16H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l9-9ZM14 5l2 2-9 9H5v-2l9-9Z" clipRule="evenodd"></path></svg>
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#" className="sidebar-nav-item">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-nav-icon">
                 <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                 <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                 <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                 <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
               </svg>
              工作空间
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-nav-item">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-nav-icon">
                 <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
              搜索
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-nav-item sidebar-nav-item-active">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-nav-arrow" style={{ transform: 'rotate(90deg)' }}>
                 <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
              对话
            </a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="sidebar-profile-avatar">L</div>
          <span className="sidebar-profile-name">liu</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;