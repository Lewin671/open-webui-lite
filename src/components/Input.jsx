import React from 'react';

const Input = () => {
  return (
    <footer className="input-container">
      <div className="input-wrapper">
        <button className="icon-btn add-btn">+</button>
        <input type="text" placeholder="Send a Message" />
        <button className="icon-btn mic-btn">🎤</button>
        <button className="icon-btn send-btn">↑</button>
      </div>
      <p className="disclaimer">LLMs can make mistakes. Verify important information.</p>
    </footer>
  );
};

export default Input;