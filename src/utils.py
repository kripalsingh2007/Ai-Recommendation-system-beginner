# AIVerse Movies - Utility Sub-Module
# Houses mathematical text definitions, HTML layout generators, and helpful glossary constants for beginners.

def get_math_explanation_html(dot_product, mag_a, mag_b, cosine_score, percentage):
    """
    Renders an HTML-styled LaTeX-like formula block with exact coordinates inputs.
    """
    return f"""
    <div style="background: rgba(7, 9, 19, 0.6); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.5; color: #f8fafc;">
        <span style="color: #64748b;"># Formula: CosineSimilarity = (A • B) / (||A|| * ||B||)</span><br>
        <span style="color: #a855f7;"># Step 1: Compute overlapping dot product coordinate sums</span><br>
        DotProduct (A • B) = <span style="color: #fff; font-weight:bold;">{dot_product:.6f}</span><br><br>
        <span style="color: #a855f7;"># Step 2: Compute vectors lengths magnitudes</span><br>
        ||A|| = <span style="color: #fff;">{mag_a:.6f}</span><br>
        ||B|| = <span style="color: #fff;">{mag_b:.6f}</span><br><br>
        <span style="color: #06b6d4;"># Step 3: Divide dot product by length multiplication</span><br>
        Similarity = {dot_product:.6f} / ({mag_a:.4f} * {mag_b:.4f})<br>
        Similarity = {dot_product:.6f} / {(mag_a * mag_b):.6f}<br>
        Similarity = <span style="color: #06b6d4; font-weight:bold; font-size: 1.1rem;">{cosine_score:.6f}</span><br><br>
        <span style="color: #22c55e;"># Final Score: {percentage}% Similarity Match</span>
    </div>
    """

def get_pipeline_html():
    """
    Renders an HTML step flow flowchart representing the calculation process.
    """
    return """
    <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 20px; border-radius: 12px; text-align: center; gap: 10px;">
        <div style="flex: 1;">
            <div style="font-weight: 900; color: #06b6d4; font-size: 1.25rem;">01</div>
            <strong style="font-size: 0.8rem; display: block; margin-top: 4px; color: #fff;">Text Cleanup</strong>
            <span style="font-size: 0.7rem; color: #64748b; display: block; margin-top: 2px;">Filters stopwords</span>
        </div>
        <div style="color: #64748b; font-size: 1.2rem;">➔</div>
        <div style="flex: 1;">
            <div style="font-weight: 900; color: #a855f7; font-size: 1.25rem;">02</div>
            <strong style="font-size: 0.8rem; display: block; margin-top: 4px; color: #fff;">TF-IDF Matrix</strong>
            <span style="font-size: 0.7rem; color: #64748b; display: block; margin-top: 2px;">Weights unique words</span>
        </div>
        <div style="color: #64748b; font-size: 1.2rem;">➔</div>
        <div style="flex: 1;">
            <div style="font-weight: 900; color: #ec4899; font-size: 1.25rem;">03</div>
            <strong style="font-size: 0.8rem; display: block; margin-top: 4px; color: #fff;">Dot Product</strong>
            <span style="font-size: 0.7rem; color: #64748b; display: block; margin-top: 2px;">Computes cosine math</span>
        </div>
        <div style="color: #64748b; font-size: 1.2rem;">➔</div>
        <div style="flex: 1;">
            <div style="font-weight: 900; color: #22c55e; font-size: 1.25rem;">04</div>
            <strong style="font-size: 0.8rem; display: block; margin-top: 4px; color: #fff;">Top Matches</strong>
            <span style="font-size: 0.7rem; color: #64748b; display: block; margin-top: 2px;">Renders glowing cards</span>
        </div>
    </div>
    """
