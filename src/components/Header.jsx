import React from 'react';

const Header = () => {
  return (
    <header className="main-header">
      <div className="model-selector">
        <h1>OpenAI / GPT 4 <span className="dropdown-arrow">∨</span> <span className="plus-icon">+</span></h1>
        <p className="default-text">Set as default</p>
      </div>
      <div className="status-banner">
        <span className="success-badge">SUCCESS</span> Open WebUI - On a mission to build the best open-source AI user interface.
      </div>
    </header>
  );
};

export default Header;