import React from 'react';

const MessageList = ({ messages }) => {
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list">
        <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
          No messages yet. Start the conversation!
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.isOwn ? 'own' : ''}`}
        >
          <div className="message-header">
            <span className="message-user">{message.username || message.user || 'Anonymous'}</span>
            <span className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="message-content">{message.message || message.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
