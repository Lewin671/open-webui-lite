import React from 'react';

const Sidebar = () => {
  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px',
      borderRight: '1px solid var(--border-color)',
      flexShrink: 0
    }}>
      <div style={{ marginBottom: '20px' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          fontWeight: '500'
        }}>
          <span style={{
            fontWeight: 'bold',
            width: '20px',
            height: '20px',
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            marginRight: '8px'
          }}>OI</span>
          New Chat
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            <span style={{ marginLeft: '8px' }}>✎</span>
            <span style={{ marginLeft: '8px' }}>≡</span>
          </div>
        </button>
      </div>
      <nav style={{ flexGrow: 1 }}>
        <ul>
          <li>
            <a href="#" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '6px',
              marginBottom: '4px',
              color: 'var(--text-medium)'
            }}>
              <span style={{ 
                marginRight: '8px',
                fontSize: '16px',
                width: '1.2em',
                textAlign: 'center',
                opacity: 0.8
              }}>⌘</span> Workspace
            </a>
          </li>
          <li>
            <a href="#" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '6px',
              marginBottom: '4px',
              color: 'var(--text-medium)'
            }}>
              <span style={{ 
                marginRight: '8px',
                fontSize: '16px',
                width: '1.2em',
                textAlign: 'center',
                opacity: 0.8
              }}>🔍</span> Search
            </a>
          </li>
        </ul>
      </nav>
      <div style={{ 
        marginTop: 'auto',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 5px'
        }}>
          <span style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-orange)',
            color: 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginRight: '8px',
            fontSize: '12px',
            flexShrink: 0
          }}>TB</span>
          <span style={{
            fontWeight: '500',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>Timothy J. Baek</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;