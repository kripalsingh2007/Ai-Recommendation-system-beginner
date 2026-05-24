import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, HelpCircle, BrainCircuit } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'aria', 
      text: "Hello! I am Aria, your AI Recommendation Guide. 🌌 I can explain TF-IDF coordinates, dot product math, 3D vector alignments, or future collaborative upgrades. What would you like to explore?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const chatbotResponses = {
    "how does cosine similarity work?": `
**Cosine Similarity** measures the angle between two movie coordinate arrows pointing in multi-dimensional space! 
*   If two movies share similar themes (e.g. *Interstellar* and *Dune*), their arrows point in almost the identical direction, yielding a score near **1.0 (100% Match)**.
*   If they are totally unrelated, their arrows are perpendicular (90°), yielding **0.0 (0% Match)**.
*   Formula: 
    $$\\cos(\\theta) = \\frac{A \\cdot B}{||A|| ||B||}$$
    `,
    "what is tf-idf in simple terms?": `
**TF-IDF** stands for **Term Frequency - Inverse Document Frequency**. It's a way of rating how important a word is to a movie description:
1.  **Term Frequency (TF)**: How often a word appears in a movie's plot (more matches = higher weight).
2.  **Inverse Document Frequency (IDF)**: How rare the word is across the *entire* catalog. A common word like "the" gets an IDF score of **0**, while a rare word like "wormhole" gets a very **high** weight!
Combined, they create a unique fingerprint coordinate for each film!
    `,
    "explain content-based vs collaborative filtering": `
Both are popular recommendation strategies:
*   **Content-Based Filtering**: Recommends items by matching their features (genres, plot terms) directly to what you searched. *Think: "Since you liked Interstellar (space, sci-fi), you might like Dune (space, sci-fi)."*
*   **Collaborative Filtering**: Recommends items based on user behavior overlap. *Think: "Since User A and User B both rated Inception and Matrix 5 stars, and User A also loved WALL-E, we recommend WALL-E to User B."*
    `,
    "how can i deploy this project?": `
To deploy the Python Streamlit engine to the cloud:
1.  Push your project folder to **GitHub**.
2.  Log into [share.streamlit.io](https://share.streamlit.io/).
3.  Click **"New App"** and select your repository.
4.  Set the main file path to: \`app/streamlit_app.py\` and click **"Deploy!"**
    `
  };

  const handleSend = (textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().replace(/[?]/g, "").trim();
      let responseText = "I'm still learning! You can ask me one of the preset concept questions below, or head over to the **How It Works** tab to inspect the math calculations directly.";
      
      // Match predefined answers
      for (const [key, val] of Object.entries(chatbotResponses)) {
        if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
          responseText = val;
          break;
        }
      }

      setMessages(prev => [...prev, { sender: 'aria', text: responseText }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {/* 1. Floating Collapse Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            boxShadow: '0 0 20px var(--primary-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-bounce)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* 2. Holographic Chat Panel */}
      {isOpen && (
        <div 
          className="glass-panel hologram-scanner"
          style={{
            width: '360px',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(90deg, rgba(168,85,247,0.15), rgba(6,182,212,0.15))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(6, 182, 212, 0.2)',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Sparkles size={16} color="var(--secondary-neon)" />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>Aria AI</strong>
                <div style={{ fontSize: '0.65rem', color: 'var(--secondary-neon)' }}>Recommendation Guide</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages list */}
          <div 
            ref={scrollRef}
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg, idx) => {
              const isAria = msg.sender === 'aria';
              return (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    alignSelf: isAria ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
                  }}
                >
                  {isAria && (
                    <div style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                      padding: '6px',
                      borderRadius: '50%',
                      marginTop: '4px'
                    }}>
                      <BrainCircuit size={12} color="var(--secondary-neon)" />
                    </div>
                  )}
                  <div style={{
                    background: isAria ? 'rgba(255, 255, 255, 0.03)' : 'rgba(168, 85, 247, 0.15)',
                    border: isAria ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(168, 85, 247, 0.3)',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    lineHeight: '1.4',
                    color: isAria ? 'var(--text-secondary)' : '#fff',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '4px', paddingLeft: '30px' }}>
                <span className="glow-badge glow-badge-cyan" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                  Aria is calculating...
                </span>
              </div>
            )}
          </div>

          {/* Quick Preset Prompts */}
          <div style={{
            padding: '8px 12px',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(0,0,0,0.1)'
          }}>
            {[
              "What is TF-IDF in simple terms?",
              "How does Cosine Similarity work?",
              "Explain Content-Based vs Collaborative Filtering"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--secondary-neon)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
            style={{
              padding: '12px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              placeholder="Ask Aria conceptual questions..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                flexGrow: 1,
                background: 'rgba(7, 9, 19, 0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.8rem',
                color: '#fff',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid var(--secondary-neon)',
                color: '#fff',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition-bounce)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary-neon)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(6,182,212,0.1)'}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
