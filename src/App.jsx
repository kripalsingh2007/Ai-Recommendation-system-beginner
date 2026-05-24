import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import ExplanationPanel from './components/ExplanationPanel';
import Visualization from './components/Visualization';
import LearningMode from './components/LearningMode';
import AIAssistant from './components/AIAssistant';
import { movies } from './data/movies';
import { buildRecommendationEngine } from './utils/recommender';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [engine, setEngine] = useState(null);
  
  // Shared Recommendation Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState('m1'); // default to Interstellar
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // Initialize recommendation engine on load
  useEffect(() => {
    const recommendationIndex = buildRecommendationEngine(movies);
    setEngine(recommendationIndex);
  }, []);

  // 3. Futuristic HTML5 Canvas Particles Background Loop
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Compile float particles
    const particles = [];
    const numParticles = 45;
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 0.5,
        dx: Math.random() * 0.2 - 0.1,
        dy: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.35 + 0.1
      });
    }
    
    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`; // glowing cyan glow dots
        ctx.fill();
        
        // Move coordinates
        p.x += p.dx;
        p.y += p.dy;
        
        // Bounce bounds
        if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
        if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
      });
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleStartSearching = (query) => {
    setSearchQuery(query);
    setSelectedMovieId('');
    setActiveSection('dashboard');
  };

  const handleSelectMovie = (id) => {
    setSelectedMovieId(id);
    setSearchQuery('');
    setActiveSection('dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-deep)',
      color: 'var(--text-primary)',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* 4. Canvas Floating Particles Network */}
      <canvas 
        id="particle-canvas" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: -1 
        }} 
      />

      {/* Animated Glowing Accent Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Header Translucent Navigation Bar */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Pages */}
      <main style={{ flexGrow: 1 }}>
        {activeSection === 'home' && (
          <Hero 
            movies={movies} 
            onStartSearching={handleStartSearching} 
            onSelectMovie={handleSelectMovie} 
          />
        )}
        {activeSection === 'dashboard' && (
          <Dashboard 
            movies={movies} 
            engine={engine}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedMovieId={selectedMovieId}
            setSelectedMovieId={setSelectedMovieId}
            selectedRecommendation={selectedRecommendation}
            setSelectedRecommendation={setSelectedRecommendation}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'explanation' && (
          <ExplanationPanel selectedRecommendation={selectedRecommendation} />
        )}
        {activeSection === 'visualization' && (
          <Visualization 
            movies={movies} 
            selectedRecommendation={selectedRecommendation}
            onSelectMovie={handleSelectMovie}
          />
        )}
        {activeSection === 'learning' && (
          <LearningMode />
        )}
      </main>

      {/* 5. Floating Chatbot Guide Assistant panel */}
      <AIAssistant />

      {/* Premium Cinematic Footer */}
      <footer className="glass-panel" style={{
        margin: '60px 20px 20px 20px',
        padding: '30px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }} className="footer-cols">
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.02em',
              background: 'linear-gradient(135deg, #fff, var(--secondary-neon))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px'
            }}>
              AIVerse Movies
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              An educational AI-powered movie search engine. Built for beginners to explore vector-space models.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Home', 'AI Recommender', 'How It Works', 'Interactive Data', 'Learning Mode'].map((sec, idx) => {
              const ids = ['home', 'dashboard', 'explanation', 'visualization', 'learning'];
              return (
                <button
                  key={sec}
                  onClick={() => setActiveSection(ids[idx])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeSection === ids[idx] ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => {
                    if (activeSection !== ids[idx]) e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {sec}
                </button>
              );
            })}
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          width: '100%',
          maxWidth: '1200px',
          paddingTop: '16px',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)'
        }}>
          © {new Date().getFullYear()} AIVerse Movies. Designed for premium aesthetics, semantic SEO, and vector deconstructions.
        </div>
      </footer>
    </div>
  );
}
