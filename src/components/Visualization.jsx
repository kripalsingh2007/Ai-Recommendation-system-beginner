import React, { useState } from 'react';
import { HelpCircle, BarChart2, Network, Compass, Info, Star } from 'lucide-react';

export default function Visualization({ movies, selectedRecommendation, onSelectMovie }) {
  const [activeTab, setActiveTab] = useState('space'); // 'space', 'flow', or 'bars'
  const [hoverNode, setHoverNode] = useState(null);

  // Curated 2D projection coordinates representing thematic similarity clusters
  // 1. Sci-Fi/Action (Bottom Left): Interstellar, Inception, Matrix, Blade Runner, Dune, Ex Machina, Avatar, Gladiator
  // 2. Animation/Fantasy (Top Left): Spirited Away, Spider-Man, WALL-E, Your Name
  // 3. Drama/Music/Comedy (Top Right): Whiplash, La La Land, Grand Budapest Hotel, Eternal Sunshine
  // 4. Thriller/Horror/Mystery (Bottom Right): Parasite, Shutter Island, Get Out, Silence of Lambs, Conjuring, Knives Out
  const projectCoords = {
    m1: { x: 180, y: 320, color: 'var(--secondary-neon)' }, // Interstellar
    m2: { x: 140, y: 280, color: 'var(--secondary-neon)' }, // Inception
    m3: { x: 220, y: 360, color: 'var(--secondary-neon)' }, // The Dark Knight
    m4: { x: 100, y: 300, color: 'var(--secondary-neon)' }, // Blade Runner 2049
    m5: { x: 80,  y: 340, color: 'var(--secondary-neon)' }, // The Matrix
    m6: { x: 200, y: 270, color: 'var(--secondary-neon)' }, // Avatar: Way of Water
    m7: { x: 150, y: 120, color: 'var(--accent-neon)' },    // Spirited Away
    m8: { x: 220, y: 100, color: 'var(--accent-neon)' },    // Spider-Man: Into Spider-Verse
    m9: { x: 420, y: 80,  color: '#22c55e' },               // Whiplash
    m10: { x: 480, y: 120, color: '#22c55e' },              // La La Land
    m11: { x: 150, y: 380, color: 'var(--secondary-neon)' }, // Dune: Part Two
    m12: { x: 380, y: 140, color: '#22c55e' },              // The Grand Budapest Hotel
    m13: { x: 440, y: 280, color: 'var(--primary-neon)' },  // Parasite
    m14: { x: 380, y: 320, color: 'var(--primary-neon)' },  // Shutter Island
    m15: { x: 480, y: 340, color: 'var(--primary-neon)' },  // Get Out
    m16: { x: 340, y: 350, color: 'var(--primary-neon)' },  // Silence of the Lambs
    m17: { x: 110, y: 240, color: 'var(--secondary-neon)' }, // Ex Machina
    m18: { x: 250, y: 230, color: 'var(--secondary-neon)' }, // Arrival
    m19: { x: 290, y: 290, color: 'var(--primary-neon)' },  // The Prestige
    m20: { x: 280, y: 90,  color: 'var(--accent-neon)' },    // Your Name.
    m21: { x: 340, y: 190, color: '#22c55e' },              // Eternal Sunshine
    m22: { x: 90,  y: 110, color: 'var(--accent-neon)' },    // WALL-E
    m23: { x: 390, y: 240, color: 'var(--primary-neon)' },  // Knives Out
    m24: { x: 490, y: 270, color: 'var(--primary-neon)' },  // The Conjuring
    m25: { x: 260, y: 380, color: 'var(--secondary-neon)' }  // Gladiator
  };

  // Compile Top-5 similarities for active selected recommendation, fallback to first 5 movies
  const activeSimilarityScores = selectedRecommendation 
    ? [selectedRecommendation] 
    : [];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 80px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    }}>
      {/* Heading */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Interactive AI Visualizations</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Explore recommendations mapped inside a projected vector coordinate plane, flowcharts, or rating models.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'space', label: '2D Projected Vector Space', icon: Compass },
          { id: 'flow', label: 'Recommendation Data Flow', icon: Network },
          { id: 'bars', label: 'Top Similarity Ratings', icon: BarChart2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--secondary-neon)' : 'var(--text-muted)',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '8px',
                borderBottom: isActive ? '2px solid var(--secondary-neon)' : '2px solid transparent',
                transition: 'var(--transition-smooth)',
                fontFamily: 'var(--font-heading)'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Render selected tab visual */}
      <div style={{ minHeight: '450px' }}>
        
        {/* VIEW 1: Vector Space Scatter Plot */}
        {activeTab === 'space' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gap: '30px'
          }} className="visuals-grid">
            
            {/* SVG Plot */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderColor: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Click coordinates to analyze the recommendation maps.</span>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary-neon)' }} /> Sci-Fi
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-neon)' }} /> Animation
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} /> Drama
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-neon)' }} /> Thriller
                  </span>
                </div>
              </div>

              <div style={{
                position: 'relative',
                background: 'rgba(7, 9, 19, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                height: '400px',
                overflow: 'hidden',
                cursor: 'crosshair'
              }}>
                <svg width="100%" height="100%" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet">
                  {/* Grid Lines */}
                  <line x1="0" y1="225" x2="600" y2="225" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="300" y1="0" x2="300" y2="450" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  
                  {/* Quadrant Titles */}
                  <text x="20" y="30" fill="var(--text-muted)" fontSize="10" fontWeight="bold">ANIMATION & FANTASY</text>
                  <text x="470" y="30" fill="var(--text-muted)" fontSize="10" fontWeight="bold">DRAMA & COMEDY</text>
                  <text x="20" y="430" fill="var(--text-muted)" fontSize="10" fontWeight="bold">SCI-FI & ACTION</text>
                  <text x="450" y="430" fill="var(--text-muted)" fontSize="10" fontWeight="bold">THRILLER & HORROR</text>

                  {/* Render Connections if node hovered */}
                  {hoverNode && (
                    <line 
                      x1="300" 
                      y1="225" 
                      x2={projectCoords[hoverNode.id].x} 
                      y2={projectCoords[hoverNode.id].y} 
                      stroke={projectCoords[hoverNode.id].color} 
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                      style={{ opacity: 0.5 }}
                    />
                  )}

                  {/* Nodes */}
                  {movies.map(movie => {
                    const coord = projectCoords[movie.id];
                    if (!coord) return null;

                    const isHovered = hoverNode?.id === movie.id;
                    const isSelected = selectedRecommendation?.movie.id === movie.id;

                    return (
                      <g 
                        key={movie.id}
                        onMouseEnter={() => setHoverNode(movie)}
                        onMouseLeave={() => setHoverNode(null)}
                        onClick={() => onSelectMovie(movie.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Selector Glow */}
                        {(isSelected || isHovered) && (
                          <circle 
                            cx={coord.x} 
                            cy={coord.y} 
                            r={isSelected ? 18 : 12} 
                            fill="none" 
                            stroke={coord.color} 
                            strokeWidth="1.5"
                            style={{ opacity: 0.7 }}
                          />
                        )}
                        <circle 
                          cx={coord.x} 
                          cy={coord.y} 
                          r={isSelected ? 8 : 6} 
                          fill={coord.color} 
                          style={{
                            boxShadow: `0 0 15px ${coord.color}`,
                            transition: 'var(--transition-smooth)'
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Sidebar Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} color="var(--primary-neon)" /> Spatial Vector Metrics
                </h3>

                {hoverNode || selectedRecommendation?.movie ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Active Target Info */}
                    <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
                      <img 
                        src={hoverNode ? hoverNode.imageUrl : selectedRecommendation.movie.imageUrl} 
                        alt="Preview"
                        style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <span className="glow-badge glow-badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                          {hoverNode ? 'Hovered Node' : 'Inspected Movie'}
                        </span>
                        <h4 style={{ fontSize: '1rem', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
                          {hoverNode ? hoverNode.title : selectedRecommendation.movie.title}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                          Released: {hoverNode ? hoverNode.releaseYear : selectedRecommendation.movie.releaseYear}
                        </p>
                      </div>
                    </div>

                    {/* Coordinates breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Normalized Axis Values</strong>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Thematic X-Coord (Genre Cluster):</span>
                        <strong style={{ color: 'var(--secondary-neon)' }}>
                          {projectCoords[hoverNode ? hoverNode.id : selectedRecommendation.movie.id]?.x} nm
                        </strong>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>Thematic Y-Coord (Keywords Density):</span>
                        <strong style={{ color: 'var(--accent-neon)' }}>
                          {projectCoords[hoverNode ? hoverNode.id : selectedRecommendation.movie.id]?.y} nm
                        </strong>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      This projection simplifies a 1200-dimensional term frequency coordinate dictionary map onto a 2D canvas, grouping films sharing similar plots and descriptors close together.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    padding: '40px 10px',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                  }}>
                    Hover over coordinate nodes in the scatter plot map to load vector spatial coordinates.
                  </div>
                )}
              </div>

              <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                <Info size={16} color="var(--secondary-neon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Note: Click on a node to load it as the reference movie in the recommender and calculate new vectors!
                </span>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: Data Flow flowchart */}
        {activeTab === 'flow' && (
          <div className="glass-panel" style={{
            padding: '40px 24px',
            borderColor: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            alignItems: 'center'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', alignSelf: 'flex-start' }}>
              Step-by-Step AI Computation Path
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '900px',
              position: 'relative',
              flexWrap: 'wrap',
              gap: '24px'
            }} className="flowchart-container">
              
              {/* Flow Arrows for SVG */}
              <div style={{
                position: 'absolute',
                top: '50px',
                left: '60px',
                right: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, var(--secondary-neon), var(--primary-neon), var(--accent-neon))',
                zIndex: 1,
                opacity: 0.3
              }} className="flowchart-line" />

              {[
                { 
                  step: '01', 
                  title: 'Data Input', 
                  desc: 'User types search text or clicks a film.', 
                  color: 'var(--secondary-neon)',
                  glow: 'var(--secondary-glow)'
                },
                { 
                  step: '02', 
                  title: 'Text Cleaning', 
                  desc: 'Removes spaces, commas, and common stopwords.', 
                  color: 'var(--primary-neon)',
                  glow: 'var(--primary-glow)'
                },
                { 
                  step: '03', 
                  title: 'Vectorizing', 
                  desc: 'Calculates TF-IDF values for remaining words.', 
                  color: 'var(--accent-neon)',
                  glow: 'var(--accent-glow)'
                },
                { 
                  step: '04', 
                  title: 'Similarity Calculation', 
                  desc: 'Runs Cosine Dot Products against all 25 catalog movies.', 
                  color: '#22c55e',
                  glow: 'rgba(34, 197, 94, 0.4)'
                }
              ].map(node => (
                <div 
                  key={node.step} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    width: '180px',
                    zIndex: 5,
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--bg-dark)',
                    border: `2px solid ${node.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: node.color,
                    boxShadow: `0 0 20px ${node.glow}`,
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {node.step}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-heading)', textAlign: 'center' }}>
                    {node.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
                    {node.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* VIEW 3: Bar Chart of Top Similarities */}
        {activeTab === 'bars' && (
          <div className="glass-panel" style={{
            padding: '24px',
            borderColor: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Cosine Scores breakdown</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Comparing the exact similarity percentage scores returned by the engine for the active selection.</p>
            </div>

            {selectedRecommendation ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                padding: '10px 0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <strong style={{ fontSize: '0.85rem', minWidth: '140px', color: 'var(--text-secondary)' }}>
                    {selectedRecommendation.movie.title}
                  </strong>
                  <div style={{
                    flexGrow: 1,
                    height: '24px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{
                      width: `${selectedRecommendation.similarity.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--primary-neon), var(--secondary-neon))',
                      boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)'
                    }} />
                    <span style={{
                      position: 'absolute',
                      right: '12px',
                      top: '2px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}>{selectedRecommendation.similarity.percentage}% AI Match</span>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '20px'
                }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Metric insights</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '8px', marginInline: 0 }}>
                    This bar chart represents a visualization of the final scalar values returned by multiplying the active vector by the movie coordinates database. A higher percentage indicates that a larger proportion of term coordinates matched between the source vector and the target movies.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                Go to the **AI Recommender** dashboard and run a search to populate similarity data bars.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
