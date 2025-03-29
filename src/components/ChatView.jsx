import React from 'react';
import './styles/ChatView.css';

const SuggestionCard = ({ title, description }) => {
  return (
    <div className="card">
      <h5>{title}</h5>
      <p>{description}</p>
      <div className="prompt-action"><span>Prompt</span> <span className="arrow-up">↑</span></div>
    </div>
  );
};

const ChatView = () => {
  return (
    <section className="chat-view">
      <div className="welcome-section">
        <div className="logo-large">
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.5 41C31.8218 41 41 31.8218 41 20.5C41 9.17816 31.8218 0 20.5 0C9.17816 0 0 9.17816 0 20.5C0 31.8218 9.17816 41 20.5 41ZM13.0098 16.8058C11.2913 16.8058 9.91699 18.017 9.91699 19.4798V26.1658C9.91699 27.6286 11.2913 28.8398 13.0098 28.8398H18.8298C20.5483 28.8398 21.9226 27.6286 21.9226 26.1658V24.9398C21.9226 23.477 20.5483 22.2658 18.8298 22.2658H16.0898V19.4798C16.0898 18.017 14.7155 16.8058 13.0098 16.8058ZM18.8298 11.8118C17.1113 11.8118 15.737 13.023 15.737 14.4858V17.2718C15.737 18.7346 17.1113 19.9458 18.8298 19.9458H21.5698V22.7318C21.5698 24.1946 22.9441 25.4058 24.6626 25.4058H30.4826C32.2011 25.4058 33.5754 24.1946 33.5754 22.7318V16.0458C33.5754 14.583 32.2011 13.3718 30.4826 13.3718H24.6626C22.9441 13.3718 21.5698 14.583 21.5698 16.0458V17.2718C21.5698 18.7346 22.9441 19.9458 24.6626 19.9458H27.4026V17.1598C27.4026 15.697 26.0283 14.4858 24.3098 14.4858H18.8298V11.8118Z" fill="currentColor"/>
          </svg>
        </div>
        <h2>OpenAI / GPT 4</h2>
        <p className="sub-heading">How can I help you today?</p>
      </div>

      <div className="suggestions-section">
        <h4><span className="icon suggested-icon">⚡</span> Suggested</h4>
        <div className="suggestion-cards">
          <SuggestionCard 
            title="Help me study" 
            description="vocabulary for a college entrance exam" 
          />
          <SuggestionCard 
            title="Give me ideas" 
            description="for what to do with my kids' art" 
          />
          <SuggestionCard 
            title="Overcome procrastination" 
            description="give me tips" 
          />
          <SuggestionCard 
            title="Tell me a fun fact" 
            description="about the Roman Empire" 
          />
        </div>
      </div>
    </section>
  );
};

export default ChatView;