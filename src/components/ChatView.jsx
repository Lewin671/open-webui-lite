import React from 'react';

const SuggestionCard = ({ title, description }) => {
  return (
    <div className="suggestion-card">
      {/* Placeholder for lightning icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="suggestion-icon">
        <path d="M10 19L12 13H9L14 5L12 11H15L10 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="suggestion-text">
          <h5 className="suggestion-card-title">{title}</h5>
          <p className="suggestion-card-description">{description}</p>
      </div>
    </div>
  );
};

const ChatView = () => {
  return (
    <section className="chat-view">
      <div className="chat-intro">
         <div className="chat-intro-logo-container">
           {/* Using splash-dark.png from the public folder */}
           <img src="/splash.png" alt="DeepSeek Logo" className="chat-intro-logo" />
         </div>
         <div className="chat-intro-title">deepseek-chat</div>
      </div>

      <div className="suggestions-container">
         {/* Removing the suggestion cards from the main view */}
         {/* <h4 className="suggestions-title">建议</h4> */}
         {/* <div className="suggestions-grid"> ... cards removed ... </div> */}
      </div>
    </section>
  );
};

export default ChatView;