import React from 'react';

// Simple component for suggestion items below input
const SuggestionItem = ({ title, description }) => {
  return (
    <div className="suggestion-item">
      <h5 className="suggestion-item-title">{title}</h5>
      <p className="suggestion-item-description">{description}</p>
    </div>
  );
};

const Input = () => {
  // Example suggestions data
  const suggestions = [
    { title: "Grammar check", description: "rewrite it for better readability" },
    { title: "Explain options trading", description: "if I'm familiar with buying and selling stocks" },
    { title: "Show me a code snippet", description: "of a website's sticky header" },
  ];

  return (
    <div className='input-and-sugesstion-container'>
      <div className="chat-input-container">
        {/* Main input bar */}
        <div className='input-bar-container'>
          <div className="input-bar">
            <button className="input-action-button input-add-button">
              {/* '+' Icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="有什么我能帮您的吗?"
              className="chat-input"
            />

            <button className="input-action-button input-mic-button">
              {/* Removed Mic Icon */}
              {/* <img src="/mic.svg" alt="Microphone" className="input-mic-icon" /> */}
              {/* Placeholder SVG for Mic */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" fill="currentColor" />
              </svg>
            </button>
            <button className="input-action-button input-support-button">
              {/* Removed Headphones Icon */}
              {/* <img src="/headphones.svg" alt="Support" className="input-support-icon" /> */}
              {/* Placeholder SVG for Headphones */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12a11 11 0 0 1 22 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12v4a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3zm18 0v4a3 3 0 0 1-3 3h-1a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a3 3 0 0 1 3 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Section Below Input */}
      <div className="suggestions-list-container">
        <div className="input-suggestions-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="suggestion-label-icon">
            <path d="M10 19L12 13H9L14 5L12 11H15L10 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>建议</span>
        </div>
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <SuggestionItem key={index} title={suggestion.title} description={suggestion.description} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Input;