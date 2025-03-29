import React from 'react';

const Input = () => {
  return (
    <footer style={{
      padding: '15px 0 10px 0',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      flexShrink: 0,
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'var(--bg-main)',
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(42, 42, 42, 0.8)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '5px 10px',
        marginBottom: '8px'
      }}>
        <button style={{
          color: 'var(--text-medium)',
          fontSize: '24px',
          padding: '8px',
          borderRadius: '4px',
          flexShrink: 0,
          fontWeight: '300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px'
        }}>+</button>
        <input 
          type="text" 
          placeholder="Send a Message" 
          style={{
            flexGrow: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-light)',
            fontSize: '14px',
            padding: '10px 5px',
            margin: '0 5px'
          }}
        />
        <button style={{
          color: 'var(--text-medium)',
          fontSize: '20px',
          padding: '8px',
          borderRadius: '4px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px'
        }}>🎤</button>
        <button style={{
          backgroundColor: 'var(--hover-bg)',
          color: 'var(--text-light)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          marginLeft: '5px'
        }}>↑</button>
      </div>
      <p style={{
        textAlign: 'center',
        fontSize: '11px',
        color: 'var(--text-medium)',
        padding: '0 10px'
      }}>LLMs can make mistakes. Verify important information.</p>
    </footer>
  );
};

export default Input;