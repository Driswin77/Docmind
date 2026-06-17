import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Trash2, Send } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    
    const userMessage = { role: 'user', content: question };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    setQuestion('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/ask', {
        question: userMessage.content,
        history: messages
      });
      
      const assistantMessage = { role: 'assistant', content: res.data.answer };
      setMessages([...updatedMessages, assistantMessage]);
      
      if (res.data.sources) setSources(res.data.sources);
    } catch (err) {
      const errorMsg = `Error: ${err.response?.data?.error || err.message}`;
      const errorAssistant = { role: 'assistant', content: errorMsg };
      setMessages([...updatedMessages, errorAssistant]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSources([]);
  };

  return (
    <main className="panel right-panel">
      <div className="chat-header">
        <div className="chat-title">
          <MessageCircle size={24} /> Chat
        </div>
        <button className="btn-clear" onClick={clearChat}>
          <Trash2 size={16} /> Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-title">👋 Welcome to DocMind!</div>
            <div className="welcome-text">
              Ask me anything about your uploaded documents.<br/>
              I'll help you find information and answer your questions.
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#eef2ff' : '#f9fafb',
              border: '1px solid #e5e7eb',
              padding: '1rem',
              borderRadius: '12px',
              maxWidth: '80%',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              <strong>{msg.role === 'user' ? 'You' : 'DocMind'}:</strong>
              <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>{msg.content}</p>
            </div>
          ))
        )}
        
        {loading && (
          <div style={{ alignSelf: 'flex-start', padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
            DocMind is thinking...
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="chat-input-container">
        <textarea 
          className="chat-textarea" 
          placeholder="Ask something about your uploaded document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              askQuestion();
            }
          }}
        />
        <div className="char-count">{question.length}/2000</div>
        <button className="btn btn-blue btn-ask" onClick={askQuestion} disabled={loading || !question.trim()}>
          <Send size={16} /> Ask
        </button>
      </div>
    </main>
  );
};

export default Chat;