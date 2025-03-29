import React from 'react';
import Header from './Header';
import ChatView from './ChatView';
import Input from './Input';

const Main = () => {
  return (
    <main style={{
      flexGrow: 1,
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '0 20px'
    }}>
      <Header />
      <ChatView />
      <Input />
      <button style={{
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-medium)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 20
      }}>?</button>
    </main>
  );
};

export default Main;