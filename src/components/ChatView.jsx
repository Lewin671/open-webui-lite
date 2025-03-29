import React from 'react';

const SuggestionCard = ({ title, description }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      padding: '20px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '120px'
    }} className="card">
      <h5 style={{
        fontSize: '15px',
        fontWeight: '500',
        marginBottom: '8px',
        color: 'var(--text-light)'
      }}>{title}</h5>
      <p style={{
        fontSize: '13px',
        color: 'var(--text-medium)',
        lineHeight: 1.4,
        flexGrow: 1,
        marginBottom: '10px'
      }}>{description}</p>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: 'var(--text-medium)',
        marginTop: 'auto'
      }} className="prompt-action">
        <span>Prompt</span> 
        <span style={{
          fontSize: '14px',
          opacity: 0
        }} className="arrow-up">↑</span>
      </div>
    </div>
  );
};

const ChatView = () => {
  return (
    <section style={{
      flexGrow: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 0',
      width: '100%'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        marginTop: '5vh',
        maxWidth: '90%'
      }}>
        <div style={{
          marginBottom: '20px',
          color: 'var(--text-light)',
          width: '41px',
          height: '41px',
          display: 'inline-block'
        }}>
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.5 41C31.8218 41 41 31.8218 41 20.5C41 9.17816 31.8218 0 20.5 0C9.17816 0 0 9.17816 0 20.5C0 31.8218 9.17816 41 20.5 41ZM13.0098 16.8058C11.2913 16.8058 9.91699 18.017 9.91699 19.4798V26.1658C9.91699 27.6286 11.2913 28.8398 13.0098 28.8398H18.8298C20.5483 28.8398 21.9226 27.6286 21.9226 26.1658V24.9398C21.9226 23.477 20.5483 22.2658 18.8298 22.2658H16.0898V19.4798C16.0898 18.017 14.7155 16.8058 13.0098 16.8058ZM18.8298 11.8118C17.1113 11.8118 15.737 13.023 15.737 14.4858V17.2718C15.737 18.7346 17.1113 19.9458 18.8298 19.9458H21.5698V22.7318C21.5698 24.1946 22.9441 25.4058 24.6626 25.4058H30.4826C32.2011 25.4058 33.5754 24.1946 33.5754 22.7318V16.0458C33.5754 14.583 32.2011 13.3718 30.4826 13.3718H24.6626C22.9441 13.3718 21.5698 14.583 21.5698 16.0458V17.2718C21.5698 18.7346 22.9441 19.9458 24.6626 19.9458H27.4026V17.1598C27.4026 15.697 26.0283 14.4858 24.3098 14.4858H18.8298V11.8118Z" fill="currentColor"/>
          </svg>
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '8px',
          color: 'var(--text-light)'
        }}>OpenAI / GPT 4</h2>
        <p style={{
          fontSize: '18px',
          color: 'var(--text-medium)'
        }}>How can I help you today?</p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto 20px auto'
      }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-medium)',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '5px'
        }}>
          <span style={{
            marginRight: '8px',
            fontSize: '16px'
          }}>⚡</span> Suggested
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
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