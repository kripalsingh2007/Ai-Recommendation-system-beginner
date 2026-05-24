import React from 'react';
import { Film, BrainCircuit, HelpCircle, BarChart2, Sparkles } from 'lucide-react';

export default function Navbar({ activeSection, setActiveSection }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '20px',
      zIndex: 100,
      margin: '0 20px 30px 20px',
      borderRadius: 'var(--radius-md)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: 'rgba(255, 255, 255, 0.06)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
    }}>
      <div 
        className="logo" 
        onClick={() => setActiveSection('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--primary-glow)'
        }}>
          <BrainCircuit size={20} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '0.02em',
          background: 'linear-gradient(135deg, #fff 40%, var(--secondary-neon))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AIVerse <span style={{ color: 'var(--primary-neon)', WebkitTextFillColor: 'initial' }}>Movies</span>
        </span>
      </div>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        {[
          { id: 'home', label: 'Home', icon: Film },
          { id: 'dashboard', label: 'AI Recommender', icon: BrainCircuit },
          { id: 'explanation', label: 'How It Works', icon: HelpCircle },
          { id: 'visualization', label: 'Interactive Data', icon: BarChart2 },
          { id: 'learning', label: 'Learning Mode', icon: Sparkles }
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                transition: 'var(--transition-smooth)',
                textShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--secondary-neon)' : 'var(--text-secondary)'} />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
