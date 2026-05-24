import React from 'react';
import { HelpCircle, Table, CheckCircle2, ChevronRight, BookOpen, Calculator, Info } from 'lucide-react';

export default function ExplanationPanel({ selectedRecommendation }) {
  if (!selectedRecommendation) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div className="glass-panel" style={{ padding: '60px 20px', borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <HelpCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No Movie Selected for Inspection</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            Go to the **AI Recommender** tab, execute a search, and select one of the recommended movies to unlock its full vector breakdown.
          </p>
        </div>
      </div>
    );
  }

  const { movie, similarity } = selectedRecommendation;
  const { score, percentage, dotProduct, queryMagnitude, docMagnitude, commonTerms } = similarity;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 80px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>How the AI Recommender Thinks</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Deconstruct the mathematical vectors and Cosine Similarity equations explaining why <strong style={{ color: 'var(--secondary-neon)' }}>{movie.title}</strong> was recommended.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '30px'
      }} className="explanation-grid">
        
        {/* LEFT COLUMN: Mathematics Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Step 1: The Core Formula */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
              filter: 'blur(10px)',
              pointerEvents: 'none'
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Calculator size={20} color="var(--primary-neon)" />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>The Cosine Similarity Formula</h3>
            </div>
            
            <div style={{
              background: 'rgba(7, 9, 19, 0.6)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center',
              margin: '16px 0',
              overflowX: 'auto'
            }}>
              <code style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: '#fff',
                display: 'inline-block',
                whiteSpace: 'nowrap'
              }}>
                CosineSimilarity(A, B) = A • B / (||A|| × ||B||)
              </code>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center', marginInline: 'auto', maxWidth: '480px' }}>
                Where <strong style={{ color: 'var(--text-secondary)' }}>A • B</strong> represents the Dot Product of overlapping term coordinates, and <strong style={{ color: 'var(--text-secondary)' }}>||A||</strong> and <strong style={{ color: 'var(--text-secondary)' }}>||B||</strong> represent the geometric lengths (Magnitudes) of the two vectors.
              </p>
            </div>
          </div>

          {/* Step 2: Overlapping Terms Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Table size={20} color="var(--secondary-neon)" />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Step 1: Overlapping Coordinates (Intersection)</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Both text vectors contain these vocabulary words. Rare terms (high IDF weights) drive the similarity upward, while common terms have reduced influence.
            </p>

            {commonTerms.length === 0 ? (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                color: 'var(--text-muted)'
              }}>
                No exact overlapping word coordinates! The recommendation is likely driven by general category clusters.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.85rem',
                  textAlign: 'left'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>VOCAB TERM</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>IDF (UNIQUENESS)</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>QUERY WT (A)</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>MOVIE WT (B)</th>
                      <th style={{ padding: '12px 8px', color: 'var(--text-muted)', textAlign: 'right' }}>PRODUCT (A × B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commonTerms.map((termItem, idx) => (
                      <tr 
                        key={termItem.term} 
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'var(--secondary-neon)' }}>
                          "{termItem.term}"
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                          {termItem.idf.toFixed(4)}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                          {termItem.queryWeight.toFixed(4)}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                          {termItem.docWeight.toFixed(4)}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>
                          {termItem.product.toFixed(6)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Step 3: Dot Product Summation */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <CheckCircle2 size={20} color="var(--primary-neon)" />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Step 2: Dot Product & Magnitudes</h3>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }} className="math-cols-grid">
              
              <div style={{
                background: 'rgba(7, 9, 19, 0.4)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Dot Product Sum</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary-neon)', fontFamily: 'var(--font-heading)' }}>
                  {dotProduct.toFixed(6)}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  The sum of products of all intersecting terms: Σ(A_i * B_i). High sum represents highly aligned keywords.
                </p>
              </div>

              <div style={{
                background: 'rgba(7, 9, 19, 0.4)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Vectors Lengths</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Query Vector Length:</span>
                    <strong style={{ color: '#fff' }}>{queryMagnitude.toFixed(4)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Movie Vector Length:</span>
                    <strong style={{ color: '#fff' }}>{docMagnitude.toFixed(4)}</strong>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                  Magnitudes reflect coordinate density. Shorter summaries have lower magnitudes, while massive blocks produce larger coordinates.
                </p>
              </div>

            </div>
          </div>

          {/* Step 4: Final calculation */}
          <div className="glass-panel" style={{
            padding: '24px',
            border: '1px solid var(--secondary-neon)',
            background: 'rgba(6, 182, 212, 0.04)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Calculator size={20} color="var(--secondary-neon)" />
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Step 3: Divide & Conclude</h3>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                flexGrow: 1
              }}>
                <div>Cosine Sim = {dotProduct.toFixed(6)} / ({queryMagnitude.toFixed(4)} × {docMagnitude.toFixed(4)})</div>
                <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                  Cosine Sim = {dotProduct.toFixed(6)} / {(queryMagnitude * docMagnitude).toFixed(6)} = <strong style={{ color: 'var(--secondary-neon)' }}>{score.toFixed(4)}</strong>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, var(--primary-neon), var(--secondary-neon))',
                padding: '20px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 0 30px var(--primary-glow)',
                minWidth: '150px'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#fff', lineHeight: 1 }}>
                  {percentage}%
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', marginTop: '4px', textTransform: 'uppercase' }}>
                  AI MATCH SCORE
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Beginner-Friendly FAQ */}
        <div style={{
          position: 'sticky',
          top: '110px',
          alignSelf: 'start',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '24px', borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <BookOpen size={20} color="var(--primary-neon)" />
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>AI Beginner's Encyclopedia</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* QA 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronRight size={14} color="var(--secondary-neon)" /> What is a TF-IDF vector?
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  It represents a movie description as a coordinate point in a massive dictionary coordinate map. 
                  <strong style={{ color: 'var(--text-muted)' }}> Term Frequency (TF)</strong> counts how often words appear locally inside the film, while 
                  <strong style={{ color: 'var(--text-muted)' }}> Inverse Document Frequency (IDF)</strong> weights rare vocabulary heavily so they act as unique fingerprints.
                </p>
              </div>

              {/* QA 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronRight size={14} color="var(--secondary-neon)" /> What is Cosine Similarity?
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Imagine each movie's keywords define an arrow pointing into space. Cosine Similarity measures the 
                  <strong style={{ color: 'var(--text-muted)' }}> angle</strong> between these arrows. If they point in identical directions, the angle is 0, giving a 
                  <strong style={{ color: 'var(--secondary-neon)' }}> 1.0 (100% Match)</strong> similarity score.
                </p>
              </div>

              {/* QA 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChevronRight size={14} color="var(--secondary-neon)" /> Why not use distance (meters)?
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  If one movie description is 500 words long and another is only 50 words, their distance in terms of length is massive. 
                  However, they might cover the exact same genres and themes! Cosine Similarity ignores description length (magnitude) and only focuses on thematic direction.
                </p>
              </div>

            </div>
          </div>

          <div className="glass-panel" style={{
            padding: '20px',
            borderColor: 'rgba(255, 255, 255, 0.06)',
            background: 'rgba(255,255,255,0.01)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <Info size={16} color="var(--primary-neon)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Tip: Head over to the **Interactive Data** tab to see this movie plotted relative to other movies in a 2D projection of the Vector Space!
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
