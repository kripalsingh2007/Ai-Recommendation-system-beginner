import React, { useState } from 'react';
import { HelpCircle, Sparkles, BookOpen, Compass, CheckCircle2, Cpu, BarChart2 } from 'lucide-react';

export default function LearningMode() {
  const [activeConcept, setActiveConcept] = useState('tfidf');
  const [hoverLayer, setHoverLayer] = useState(null);

  // Concept definitions
  const concepts = {
    tfidf: {
      title: "TF-IDF Word Fingerprints",
      icon: BookOpen,
      color: "var(--secondary-neon)",
      analogy: "Think of TF-IDF like a text highlighter. It automatically highlights words that define a movie's plot, while completely ignoring boring common words.",
      math: "TF-IDF = TF(t, d) * IDF(t)",
      details: [
        "Term Frequency (TF): Counts the density of a keyword locally inside a film description. More matches increase the score.",
        "Inverse Document Frequency (IDF): Penalizes common catalog words. Unique terms like 'spacecraft' get boosted, while 'movie' is suppressed.",
        "The end result is a highly tailored, sparse vector space coordinate that acts as the movie's unique fingerprint."
      ]
    },
    cosine: {
      title: "Cosine Similarity Angles",
      icon: Compass,
      color: "var(--primary-neon)",
      analogy: "Imagine all movies are arrows pointing into space from a single center point. Cosine Similarity is simply a compass measuring the angle between two movie arrows.",
      math: "Similarity = (A * B) / (||A|| * ||B||)",
      details: [
        "If two arrows point in the exact same direction, the angle is 0, returning a perfect 1.0 (100% Match) score.",
        "If the descriptions share absolutely zero terms, the arrows are perpendicular (90°), yielding a 0.0 (0% Match) score.",
        "By focusing only on directional angles, Cosine Similarity ensures that description lengths do not skew recommendations."
      ]
    },
    deep: {
      title: "Neural Collaborative Filtering",
      icon: Cpu,
      color: "var(--accent-neon)",
      analogy: "Instead of comparing dictionary words, Deep Learning automatically invents hidden dimensions (embeddings) representing abstract vibes, learning tastes from user patterns.",
      math: "Rating = NeuralNet(User_Embedding, Movie_Embedding)",
      details: [
        "Embedding Layers map sparse IDs into compact continuous dense vector coordinates.",
        "Multilayer Perceptrons (MLPs) process non-linear dimensional interactions to discover extremely complex latent relationships.",
        "This is the futuristic model power fueling Netflix and Spotify's recommendation engines today!"
      ]
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 80px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Interactive AI Learning Mode</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Master recommendation algorithm systems, vector calculations, and deep learning neural architectures visually.
        </p>
      </div>

      {/* Concept Selector Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {Object.entries(concepts).map(([key, item]) => {
          const Icon = item.icon;
          const isActive = activeConcept === key;
          return (
            <div
              key={key}
              onClick={() => setActiveConcept(key)}
              className="glass-panel"
              style={{
                padding: '24px',
                cursor: 'pointer',
                borderColor: isActive ? item.color : 'rgba(255,255,255,0.06)',
                background: isActive ? `rgba(${key === 'tfidf' ? '6,182,212' : key === 'cosine' ? '168,85,247' : '236,72,153'}, 0.06)` : 'var(--bg-card)',
                boxShadow: isActive ? `0 0 20px ${isActive ? 'rgba(6,182,212,0.1)' : 'transparent'}` : 'none',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  background: `rgba(${key === 'tfidf' ? '6,182,212' : key === 'cosine' ? '168,85,247' : '236,72,153'}, 0.15)`,
                  padding: '10px',
                  borderRadius: '10px',
                  display: 'flex'
                }}>
                  <Icon size={20} color={item.color} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {item.analogy}
              </p>
            </div>
          );
        })}
      </div>

      {/* Concept Breakdown Console */}
      <div className="glass-panel" style={{
        padding: '30px',
        borderColor: 'rgba(255,255,255,0.06)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px'
      }} className="concept-grid">
        
        {/* Left Side: Explanations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span className="glow-badge glow-badge-cyan" style={{ fontSize: '0.65rem' }}>Core Algorithm Principle</span>
            <h2 style={{ fontSize: '1.5rem', marginTop: '10px', fontFamily: 'var(--font-heading)' }}>
              {concepts[activeConcept].title}
            </h2>
          </div>

          <div style={{
            background: 'rgba(7, 9, 19, 0.6)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
            fontFamily: 'Courier New, monospace',
            fontSize: '1rem',
            color: '#fff'
          }}>
            {concepts[activeConcept].math}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {concepts[activeConcept].details.map((detail, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color={concepts[activeConcept].color} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Nodes Visuals */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(7,9,19,0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.04)',
          padding: '24px',
          minHeight: '340px'
        }}>
          {activeConcept === 'tfidf' && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '16px' }}>Sparse Keyword Coordinate Map</strong>
              <svg width="100%" height="220" viewBox="0 0 400 220">
                {/* Horizontal Axis lines */}
                <line x1="40" y1="180" x2="360" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                <line x1="40" y1="180" x2="40" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                
                {/* Vector Bars representing term coordinate heights */}
                {[
                  { label: "space", val: 140, color: 'var(--secondary-neon)' },
                  { label: "wormhole", val: 110, color: 'var(--secondary-neon)' },
                  { label: "espionage", val: 20, color: 'var(--text-muted)' },
                  { label: "jazz", val: 10, color: 'var(--text-muted)' },
                  { label: "demons", val: 5, color: 'var(--text-muted)' }
                ].map((bar, idx) => {
                  const bx = 80 + idx * 60;
                  return (
                    <g key={bar.label}>
                      <rect 
                        x={bx - 15} 
                        y={180 - bar.val} 
                        width="30" 
                        height={bar.val} 
                        fill={bar.color} 
                        rx="4"
                        style={{ opacity: 0.85, transition: 'var(--transition-smooth)' }}
                      />
                      <text x={bx} y="198" fill="var(--text-muted)" fontSize="8" textAnchor="middle">"{bar.label}"</text>
                      <text x={bx} y={170 - bar.val} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">{(bar.val/200).toFixed(2)}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {activeConcept === 'cosine' && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '16px' }}>Vector Angle Compass</strong>
              <svg width="100%" height="220" viewBox="0 0 400 220">
                <circle cx="200" cy="180" r="140" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                <circle cx="200" cy="180" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" strokeWidth="1" />
                
                {/* Reference lines */}
                <line x1="200" y1="180" x2="200" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
                <line x1="200" y1="180" x2="340" y2="180" stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />

                {/* Vectors */}
                {/* Movie A: Interstellar (40 deg) */}
                <line x1="200" y1="180" x2="290" y2="105" stroke="var(--secondary-neon)" strokeWidth="3" markerEnd="url(#arrow)" />
                <text x="310" y="100" fill="var(--secondary-neon)" fontSize="9" fontWeight="bold">Interstellar (A)</text>
                
                {/* Movie B: Dune 2 (55 deg) */}
                <line x1="200" y1="180" x2="270" y2="85" stroke="var(--primary-neon)" strokeWidth="3" />
                <text x="290" y="75" fill="var(--primary-neon)" fontSize="9" fontWeight="bold">Dune 2 (B)</text>

                {/* The Angle bracket */}
                <path d="M 235 151 A 50 50 0 0 0 252 136" fill="none" stroke="var(--accent-neon)" strokeWidth="2" />
                <text x="260" y="150" fill="var(--accent-neon)" fontSize="10" fontWeight="bold">Angle θ</text>

                {/* Center Node */}
                <circle cx="200" cy="180" r="6" fill="#fff" />
              </svg>
            </div>
          )}

          {activeConcept === 'deep' && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '8px' }}>Neural Collaborative Network (NCF)</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>Hover layers to deconstruct deep learning dimensions.</span>
              
              <svg width="100%" height="220" viewBox="0 0 400 220" style={{ cursor: 'pointer' }}>
                {/* Nodes rendering user/item layers */}
                {/* Layer 1: Inputs (X = 40) */}
                {[
                  { id: 'in1', y: 70, label: "User ID", color: 'var(--secondary-neon)' },
                  { id: 'in2', y: 150, label: "Movie ID", color: 'var(--primary-neon)' }
                ].map(node => (
                  <g key={node.id} onMouseEnter={() => setHoverLayer(node.label)} onMouseLeave={() => setHoverLayer(null)}>
                    <circle cx="50" cy={node.y} r="16" fill="var(--bg-dark)" stroke={node.color} strokeWidth="2" />
                    <text x="50" y={node.y + 4} fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">{node.id === 'in1' ? 'U' : 'M'}</text>
                    <text x="50" y={node.y + 24} fill="var(--text-muted)" fontSize="7" textAnchor="middle">{node.label}</text>
                  </g>
                ))}

                {/* Layer 2: Embedding Layers (X = 160) */}
                {[
                  { id: 'emb1', y: 40, label: "User Embedding (Latent preferences coordinates)" },
                  { id: 'emb2', y: 90, label: "Item Embedding (Latent thematic coordinate vectors)" },
                  { id: 'emb3', y: 140, label: "MLP Layer 1 (Weights matrix interactions)" },
                  { id: 'emb4', y: 180, label: "MLP Layer 2 (Abstract conceptual groupings)" }
                ].map(node => (
                  <g key={node.id} onMouseEnter={() => setHoverLayer(node.label)} onMouseLeave={() => setHoverLayer(null)}>
                    <circle cx="180" cy={node.y} r="10" fill="var(--bg-dark)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                  </g>
                ))}

                {/* Layer 3: Predicted Output (X = 320) */}
                <g onMouseEnter={() => setHoverLayer("Output Score (Predicted rating match ratio)")} onMouseLeave={() => setHoverLayer(null)}>
                  <circle cx="310" cy="110" r="16" fill="var(--bg-dark)" stroke="var(--accent-neon)" strokeWidth="2" />
                  <text x="310" y="113" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">94%</text>
                  <text x="310" y="134" fill="var(--text-muted)" fontSize="7" textAnchor="middle">Output Match</text>
                </g>

                {/* Connectors lines */}
                {/* Input -> Embeddings */}
                <line x1="66" y1="70" x2="170" y2="40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="66" y1="70" x2="170" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="66" y1="150" x2="170" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="66" y1="150" x2="170" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* Embeddings -> MLP layers */}
                <line x1="190" y1="40" x2="310" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="190" y1="90" x2="310" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="190" y1="140" x2="310" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="190" y1="180" x2="310" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              </svg>

              {/* Holographic Tooltip */}
              <div style={{
                height: '40px',
                fontSize: '0.75rem',
                color: hoverLayer ? 'var(--accent-neon)' : 'var(--text-muted)',
                fontStyle: hoverLayer ? 'normal' : 'italic',
                textAlign: 'center',
                marginTop: '10px'
              }}>
                {hoverLayer ? `Active Node: ${hoverLayer}` : "Hover network layers above to inspect neural pipelines."}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
