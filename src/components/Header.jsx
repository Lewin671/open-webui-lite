import React from 'react';

const Header = () => {
  return (
    <header style={{
      padding: '12px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      borderBottom: '1px solid var(--border-color)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--bg-main)',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '15px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap'
          }}>
            OpenAI / GPT 4
            <span style={{
              fontSize: '12px',
              color: 'var(--text-medium)',
              marginLeft: '4px',
              cursor: 'pointer',
              display: 'inline-block',
              paddingTop: '2px'
            }}>∨</span> 
            <span style={{
              fontSize: '14px',
              color: 'var(--text-medium)',
              marginLeft: '4px',
              cursor: 'pointer',
              fontWeight: 'normal'
            }}>+</span>
          </h1>
        </div>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-medium)',
          marginLeft: '12px'
        }}>Set as default</p>
      </div>
      <div style={{
        fontSize: '13px',
        color: 'var(--text-medium)',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.3'
      }}>
        <span style={{
          backgroundColor: 'var(--accent-green)',
          color: '#ffffff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
          marginRight: '8px',
          verticalAlign: 'middle',
          display: 'inline-block'
        }}>SUCCESS</span> 
        Open WebUI - On a mission to build the best open-source AI user interface.
      </div>
    </header>
  );
};

export default Header;