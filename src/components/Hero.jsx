import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, ArrowRight, Play } from 'lucide-react';

export default function Hero({ movies, onStartSearching, onSelectMovie }) {
  const [query, setQuery] = useState('');

  // Selected floating 3D showcase movies
  const showcaseMovies = [
    movies.find(m => m.id === 'm1'), // Interstellar
    movies.find(m => m.id === 'm5'), // The Matrix
    movies.find(m => m.id === 'm2')  // Inception
  ].filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onStartSearching(query);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '80px'
    }}>
      {/* Hero Section Banner */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }} className="hero-grid">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px'
        }}>
          <div className="glow-badge glow-badge-cyan" style={{ fontSize: '0.8rem' }}>
            <Sparkles size={12} />
            Next-Gen Recommendation Engine
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.1,
            fontWeight: 900
          }}>
            Explore the Cinematic Multiverse with <span className="gradient-text">AI Vector Math</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '540px' }}>
            AIVerse Movies utilizes advanced TF-IDF descriptions and multi-dimensional Cosine Similarity vectors to find your perfect films. Discover recommendations and inspect the math behind the algorithm interactively.
          </p>

          <form onSubmit={handleSubmit} style={{
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
            marginTop: '10px'
          }}>
            <div className="glass-panel" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.1)'
            }}>
              <Search size={20} color="var(--text-muted)" style={{ marginLeft: '16px', marginRight: '10px' }} />
              <input 
                type="text" 
                placeholder="Search by keywords (e.g. 'space time travel', 'jazz dream')..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '1rem',
                  outline: 'none',
                  padding: '10px 0'
                }}
              />
              <button 
                type="submit" 
                className="neon-btn neon-btn-secondary"
                style={{ padding: '10px 20px', borderRadius: '12px' }}
              >
                Analyze
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try searching:</span>
            {['cyberpunk detective', 'haunted mansion', 'magical adventure'].map(term => (
              <button
                key={term}
                onClick={() => { setQuery(term); onStartSearching(term); }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--secondary-neon)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* 3D floating showcase */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: '400px',
          perspective: '1200px'
        }} className="hero-3d-showcase">
          {showcaseMovies.map((movie, idx) => {
            // Position parameters to create an staggered floating overlapping layout
            const offsets = [
              { left: '10%', top: '5%', rot: '8deg', depth: 'translateZ(60px)', delay: '0s' },
              { left: '45%', top: '25%', rot: '-6deg', depth: 'translateZ(100px)', delay: '1.5s' },
              { left: '20%', top: '50%', rot: '4deg', depth: 'translateZ(40px)', delay: '3s' }
            ];
            const style = offsets[idx];
            
            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie.id)}
                className="poster-3d-wrap animate-float"
                style={{
                  position: 'absolute',
                  left: style.left,
                  top: style.top,
                  width: '180px',
                  cursor: 'pointer',
                  zIndex: idx === 1 ? 10 : 5,
                  animationDelay: style.delay
                }}
              >
                <div 
                  className="poster-3d-card glass-panel"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{
                    height: '240px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(4px)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: 'var(--secondary-neon)'
                    }}>
                      ★ {movie.rating}
                    </div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {movie.title}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginTop: '6px',
                      overflow: 'hidden'
                    }}>
                      {movie.genres.slice(0, 2).map(g => (
                        <span key={g} style={{
                          fontSize: '0.65rem',
                          background: 'rgba(255,255,255,0.06)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)'
                        }}>{g}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discovery banner / Preview carousel */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={20} color="var(--primary-neon)" />
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Trending Cinematic Nodes</h2>
          </div>
          <button 
            onClick={() => onStartSearching('')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--secondary-neon)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0px)'}
          >
            Launch Core Dashboard <ArrowRight size={16} />
          </button>
        </div>

        <div className="carousel-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {movies.slice(0, 5).map(movie => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie.id)}
              className="glass-panel glass-panel-hover"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative'
              }}
            >
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={movie.imageUrl} 
                  alt={movie.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  className="carousel-img"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 30%, rgba(7, 9, 19, 0.95))'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span className="glow-badge glow-badge-purple" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    ★ {movie.rating}
                  </span>
                </div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
                <h3 style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {movie.title}
                </h3>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {movie.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  flexWrap: 'wrap',
                  marginTop: 'auto'
                }}>
                  {movie.genres.map(g => (
                    <span key={g} style={{
                      fontSize: '0.65rem',
                      background: 'rgba(6, 182, 212, 0.08)',
                      color: 'var(--secondary-neon)',
                      border: '1px solid rgba(6, 182, 212, 0.15)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>{g}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
