import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Star, Flame, Clock, Award, Info, HelpCircle } from 'lucide-react';
import { getRecommendationsByMovie, getRecommendationsByQuery } from '../utils/recommender';

export default function Dashboard({ 
  movies, 
  engine, 
  searchQuery, 
  setSearchQuery, 
  selectedMovieId, 
  setSelectedMovieId, 
  selectedRecommendation, 
  setSelectedRecommendation,
  setActiveSection 
}) {
  const [activeTab, setActiveTab] = useState(selectedMovieId ? 'movie' : 'text'); // 'text' or 'movie'
  const [tempTextQuery, setTempTextQuery] = useState(searchQuery || '');
  const [recommendations, setRecommendations] = useState([]);
  
  // Filtering States
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [minPopularity, setMinPopularity] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (movieId, e) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [movieId]: !prev[movieId]
    }));
  };

  // Compile all available genres for filter list
  const allGenres = ['All', ...Array.from(new Set(movies.flatMap(m => m.genres)))];

  // Recalculate recommendations when inputs change
  useEffect(() => {
    if (!engine) return;

    let recs = [];
    if (activeTab === 'text') {
      if (searchQuery.trim()) {
        recs = getRecommendationsByQuery(searchQuery, engine, movies, 10);
      } else {
        recs = [];
      }
    } else {
      if (selectedMovieId) {
        recs = getRecommendationsByMovie(selectedMovieId, engine, movies, 10);
      } else {
        recs = [];
      }
    }

    setRecommendations(recs);
    
    // Auto-select first recommendation for explanation if none selected or if query changed
    if (recs.length > 0) {
      setSelectedRecommendation(recs[0]);
    } else {
      setSelectedRecommendation(null);
    }
  }, [activeTab, searchQuery, selectedMovieId, engine, movies]);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(tempTextQuery);
  };

  const handleReset = () => {
    setTempTextQuery('');
    setSearchQuery('');
    setSelectedMovieId(movies[0].id);
    setSelectedGenre('All');
    setMinRating(0);
    setMinPopularity(0);
    if (recommendations.length > 0) {
      setSelectedRecommendation(recommendations[0]);
    }
  };

  // Filter recommendations based on UI filters
  const filteredRecs = recommendations.filter(rec => {
    const movie = rec.movie;
    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
    const matchesRating = movie.rating >= minRating;
    const matchesPopularity = movie.popularity >= minPopularity;
    return matchesGenre && matchesRating && matchesPopularity;
  });

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 80px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    }}>
      {/* Dashboard Heading */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>AI Recommender Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Query the recommendation engine or select reference movies to search coordinates.</p>
        </div>
        <button 
          onClick={handleReset}
          className="glass-panel"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'var(--text-secondary)',
            padding: '10px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }}
        >
          <RefreshCw size={16} /> Reset Engine
        </button>
      </div>

      {/* Control Panel: Text Search vs Reference Movie */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderColor: 'rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Search Mode Toggles */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: '16px',
          gap: '24px'
        }}>
          <button
            onClick={() => { setActiveTab('text'); }}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'text' ? 'var(--secondary-neon)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              paddingBottom: '8px',
              borderBottom: activeTab === 'text' ? '2px solid var(--secondary-neon)' : '2px solid transparent',
              transition: 'var(--transition-smooth)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            🔍 Search by Description / Keywords
          </button>
          <button
            onClick={() => { setActiveTab('movie'); }}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'movie' ? 'var(--primary-neon)' : 'var(--text-muted)',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              paddingBottom: '8px',
              borderBottom: activeTab === 'movie' ? '2px solid var(--primary-neon)' : '2px solid transparent',
              transition: 'var(--transition-smooth)',
              fontFamily: 'var(--font-heading)'
            }}
          >
            🎬 Similar to a Reference Movie
          </button>
        </div>

        {/* Input Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '16px',
          alignItems: 'center'
        }} className="controls-grid">
          {activeTab === 'text' ? (
            <form onSubmit={handleTextSubmit} style={{ width: '100%' }}>
              <div style={{
                display: 'flex',
                background: 'rgba(7, 9, 19, 0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '6px 12px',
                alignItems: 'center'
              }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '10px' }} />
                <input
                  type="text"
                  placeholder="Enter text descriptors (e.g. 'dream within dreams', 'futuristic space alien planet')..."
                  value={tempTextQuery}
                  onChange={(e) => setTempTextQuery(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    color: '#fff',
                    outline: 'none',
                    padding: '10px 0',
                    fontSize: '0.95rem'
                  }}
                />
                <button 
                  type="submit" 
                  className="neon-btn neon-btn-secondary"
                  style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  Query Space
                </button>
              </div>
            </form>
          ) : (
            <div style={{ width: '100%' }}>
              <select
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(7, 9, 19, 0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#fff',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer'
                }}
              >
                {movies.map(movie => (
                  <option key={movie.id} value={movie.id} style={{ background: '#0a0e22', color: '#fff' }}>
                    {movie.title} ({movie.genres.slice(0, 2).join(', ')})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="glass-panel"
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: showFilters ? '1px solid var(--secondary-neon)' : '1px solid rgba(255,255,255,0.06)',
              background: showFilters ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255,255,255,0.02)',
              color: showFilters ? 'var(--secondary-neon)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Filter Sliders Panel (Collapsible) */}
        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            {/* Genre Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>GENRE LIMITER</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.85rem'
                }}
              >
                {allGenres.map(g => (
                  <option key={g} value={g} style={{ background: '#0a0e22' }}>{g}</option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MINIMUM RATING</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--secondary-neon)', fontWeight: 'bold' }}>★ {minRating.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                style={{ accentColor: 'var(--secondary-neon)', cursor: 'pointer' }}
              />
            </div>

            {/* Minimum Popularity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MIN POPULARITY</label>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-neon)', fontWeight: 'bold' }}>🔥 {minPopularity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={minPopularity}
                onChange={(e) => setMinPopularity(parseInt(e.target.value))}
                style={{ accentColor: 'var(--primary-neon)', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Results Layout */}
      {recommendations.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '60px 20px',
          textAlign: 'center',
          borderColor: 'rgba(255, 255, 255, 0.06)'
        }}>
          <HelpCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Coordinates Found</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            {activeTab === 'text' 
              ? "Query vector is empty. Enter descriptives like 'space' or 'cyberpunk' to initialize recommendation maps."
              : "Select a reference movie to trigger high-dimensional calculations."}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '30px'
        }} className="dashboard-grid">
          
          {/* LEFT COLUMN: Recommendation Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}>
                Vector Matches ({filteredRecs.length} movies)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Click a card to inspect mathematical vectors.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredRecs.map(rec => {
                const isSelected = selectedRecommendation?.movie.id === rec.movie.id;
                const matchColor = rec.similarity.percentage > 70 
                  ? 'var(--secondary-neon)' 
                  : rec.similarity.percentage > 40 
                    ? 'var(--primary-neon)' 
                    : 'var(--accent-neon)';

                const isFlipped = !!flippedCards[rec.movie.id];

                return (
                  <div 
                    key={rec.movie.id} 
                    className={`flip-card ${isFlipped ? 'flipped' : ''}`}
                    style={{ height: '162px', zIndex: isSelected ? 20 : 1 }}
                  >
                    <div className="flip-card-inner" style={{ height: '100%' }}>
                      
                      {/* FRONT CARD: Movie Info */}
                      <div 
                        className="flip-card-front glass-panel"
                        onClick={() => setSelectedRecommendation(rec)}
                        style={{
                          height: '100%',
                          display: 'flex',
                          padding: '16px',
                          cursor: 'pointer',
                          gap: '20px',
                          alignItems: 'center',
                          borderColor: isSelected 
                            ? 'var(--secondary-neon)' 
                            : 'rgba(255, 255, 255, 0.06)',
                          background: isSelected 
                            ? 'rgba(6, 182, 212, 0.08)' 
                            : 'var(--bg-card)',
                          boxShadow: isSelected 
                            ? '0 0 20px rgba(6, 182, 212, 0.15)' 
                            : '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        {/* Poster Thumbnail */}
                        <div style={{
                          width: '90px',
                          height: '130px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          position: 'relative'
                        }}>
                          <img 
                            src={rec.movie.imageUrl} 
                            alt={rec.movie.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        {/* Movie Info */}
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                            <div>
                              <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                                {rec.movie.title}
                              </h4>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {rec.movie.releaseYear} • {rec.movie.runtime} • Dir: {rec.movie.director}
                              </span>
                            </div>

                            {/* Match Badge */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: '4px'
                            }}>
                              <span style={{
                                padding: '4px 10px',
                                background: `rgba(${rec.similarity.percentage > 70 ? '6,182,212' : '168,85,247'}, 0.15)`,
                                border: `1px solid ${matchColor}`,
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: matchColor,
                                textShadow: `0 0 5px ${matchColor}`
                              }}>
                                {rec.similarity.percentage}% Match
                              </span>
                            </div>
                          </div>

                          <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.4',
                            margin: 0
                          }}>
                            {rec.movie.description}
                          </p>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '4px'
                          }}>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              {rec.movie.genres.map(g => (
                                <span key={g} style={{
                                  fontSize: '0.65rem',
                                  background: 'rgba(255,255,255,0.04)',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  color: 'var(--text-secondary)'
                                }}>{g}</span>
                              ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} color="#fbbf24" fill="#fbbf24" /> {rec.movie.rating}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
                                <Flame size={12} color="#f97316" fill="#f97316" /> {rec.movie.popularity}%
                              </span>
                              
                              {/* FLIP TRIGGER BUTTON */}
                              <button
                                onClick={(e) => toggleFlip(rec.movie.id, e)}
                                style={{
                                  background: 'rgba(168, 85, 247, 0.1)',
                                  border: '1px solid var(--primary-neon)',
                                  color: 'var(--primary-neon)',
                                  borderRadius: '6px',
                                  padding: '2px 8px',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--primary-neon)';
                                  e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                                  e.currentTarget.style.color = 'var(--primary-neon)';
                                }}
                              >
                                Math Vectors
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BACK CARD: Hologram Math Vector Inspector */}
                      <div 
                        className="flip-card-back glass-panel hologram-scanner"
                        onClick={() => setSelectedRecommendation(rec)}
                        style={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '16px',
                          cursor: 'pointer',
                          justifyContent: 'space-between',
                          borderColor: 'var(--secondary-neon)',
                          background: 'rgba(7, 9, 19, 0.9)',
                          boxShadow: '0 0 25px rgba(6, 182, 212, 0.15)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--secondary-neon)', fontFamily: 'var(--font-heading)' }}>
                            Holographic Cosine Analyzer
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#fff', opacity: 0.6 }}>
                            {rec.movie.title}
                          </span>
                        </div>

                        {/* Top Overlapping words */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, justifyContent: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TOP VECTOR COORDINATES MATCHES:</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {rec.similarity.commonTerms && rec.similarity.commonTerms.length > 0 ? (
                              rec.similarity.commonTerms.slice(0, 2).map(term => (
                                <div key={term.term} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                  <span style={{ fontWeight: 'bold', color: '#fff' }}>"{term.term}"</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>A:{term.queryWeight.toFixed(3)} * B:{term.docWeight.toFixed(3)}</span>
                                    <strong style={{ color: 'var(--secondary-neon)' }}>={term.product.toFixed(4)}</strong>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                No overlapping word coordinates. Matching clusters general categories.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer details inside card back */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Dot Product: <strong style={{ color: '#fff' }}>{rec.similarity.dotProduct.toFixed(4)}</strong>
                          </div>
                          
                          <button
                            onClick={(e) => toggleFlip(rec.movie.id, e)}
                            style={{
                              background: 'rgba(6, 182, 212, 0.1)',
                              border: '1px solid var(--secondary-neon)',
                              color: 'var(--secondary-neon)',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--secondary-neon)';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                              e.currentTarget.style.color = 'var(--secondary-neon)';
                            }}
                          >
                            Show Info
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Selection detail context panel */}
          <div style={{
            position: 'sticky',
            top: '110px',
            alignSelf: 'start',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {selectedRecommendation ? (
              <div className="glass-panel" style={{
                padding: '24px',
                borderColor: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img 
                    src={selectedRecommendation.movie.imageUrl} 
                    alt={selectedRecommendation.movie.title}
                    style={{
                      width: '80px',
                      height: '115px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span className="glow-badge glow-badge-cyan" style={{ fontSize: '0.65rem' }}>
                      Selected Recommendation
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                      {selectedRecommendation.movie.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Directed by <strong style={{ color: 'var(--text-secondary)' }}>{selectedRecommendation.movie.director}</strong>
                    </p>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={16} color="var(--secondary-neon)" />
                    <strong style={{ fontSize: '0.85rem' }}>Recommendation Vector Match</strong>
                  </div>
                  
                  {/* Neon Match Bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Cosine Similarity:</span>
                      <strong style={{ color: 'var(--secondary-neon)' }}>{selectedRecommendation.similarity.percentage}% Match</strong>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${selectedRecommendation.similarity.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary-neon), var(--secondary-neon))',
                        boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(7, 9, 19, 0.4)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MATCH MATRIX</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Dot Product:</span>
                    <span>{selectedRecommendation.similarity.dotProduct.toFixed(6)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Movie Vector Magnitude:</span>
                    <span>{selectedRecommendation.similarity.docMagnitude.toFixed(6)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Query Vector Magnitude:</span>
                    <span>{selectedRecommendation.similarity.queryMagnitude.toFixed(6)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSection('explanation')}
                  className="neon-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.9rem'
                  }}
                >
                  Deconstruct Mathematical Formulas
                </button>
              </div>
            ) : (
              <div className="glass-panel" style={{
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                Please select a movie recommendation on the left column to inspect its vector metrics.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
