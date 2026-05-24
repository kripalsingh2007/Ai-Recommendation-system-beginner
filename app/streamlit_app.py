# AIVerse Movies - Modular Streamlit Application
# Imports core math engines and graphics plots from src/ subdirectories cleanly.

import sys
import os
# Dynamically add project root directory to python path for modular src imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import pandas as pd
from src.recommender import (
    load_and_clean_data, 
    top_popular_movies, 
    get_recommendations, 
    show_similarity_score
)
from src.visualization import (
    plot_popularity_bar, 
    plot_coordinate_clusters,
    plot_ratings_heatmap
)
from src.utils import (
    get_math_explanation_html, 
    get_pipeline_html
)

# Page Setup
st.set_page_config(
    page_title="AIVerse Movies | Python AI Dashboard",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom premium styling matching our React SPA design system
st.markdown("""
<style>
    /* Main container styling */
    .stApp {
        background: #060814;
        color: #f8fafc;
    }
    
    /* Sidebar styling overrides */
    section[data-testid="stSidebar"] {
        background-color: rgba(10, 14, 34, 0.95) !important;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Headings custom font styling */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Outfit', sans-serif !important;
        letter-spacing: -0.02em;
    }
    
    /* Glowing card panel */
    .glass-card {
        background: rgba(13, 18, 38, 0.5);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    
    .glass-card-glow-cyan {
        border-color: rgba(6, 182, 212, 0.2);
        box-shadow: 0 0 15px rgba(6, 182, 212, 0.05);
    }
    
    .glass-card-glow-purple {
        border-color: rgba(168, 85, 247, 0.2);
        box-shadow: 0 0 15px rgba(168, 85, 247, 0.05);
    }

    /* Text highlight colors */
    .neon-text-cyan {
        color: #06b6d4;
        font-weight: bold;
    }
    
    .neon-text-purple {
        color: #a855f7;
        font-weight: bold;
    }

    /* Clean progress meters */
    .meter-container {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        overflow: hidden;
        height: 10px;
        margin-top: 6px;
        border: 1px solid rgba(255, 255, 255, 0.02);
    }
    
    .meter-bar-cyan {
        background: linear-gradient(90deg, #a855f7, #06b6d4);
        height: 100%;
    }
</style>
""", unsafe_allow_html=True)

# Movie Poster Images mapping (matching React SPA Unsplash references)
MOVIE_IMAGES = {
    "Interstellar": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80",
    "Inception": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80",
    "The Dark Knight": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
    "Blade Runner 2049": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80",
    "The Matrix": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80",
    "Avatar: The Way of Water": "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=300&q=80",
    "Spirited Away": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80",
    "Spider-Man: Into the Spider-Verse": "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=300&q=80",
    "Whiplash": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=300&q=80",
    "La La Land": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80",
    "Dune: Part Two": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=300&q=80",
    "The Grand Budapest Hotel": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
    "Parasite": "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=300&q=80",
    "Shutter Island": "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=300&q=80",
    "Get Out": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=300&q=80",
    "The Silence of the Lambs": "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=300&q=80",
    "Ex Machina": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80",
    "Arrival": "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=300&q=80",
    "The Prestige": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80",
    "Your Name.": "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=300&q=80",
    "Eternal Sunshine of the Spotless Mind": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80",
    "WALL-E": "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=300&q=80",
    "WALL·E": "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=300&q=80",
    "Knives Out": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=300&q=80",
    "The Conjuring": "https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&w=300&q=80",
    "Gladiator": "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=300&q=80"
}

def get_movie_image_url(title):
    return MOVIE_IMAGES.get(title, "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80")

# Cache loaded data models
@st.cache_resource
def init_engine():
    # Load from the new structured subfolders path
    return load_and_clean_data("data/movies.csv", "data/ratings.csv")

try:
    df, vectorizer, tfidf_matrix, cosine_sim = init_engine()
except Exception as e:
    st.error(f"Failed to load dataset: {e}. Please ensure data/movies.csv is present.")
    st.stop()

# Sidebar Brand Box
st.sidebar.markdown("""
<div style="text-align: center; padding: 10px 0 20px 0;">
    <h2 style="color: #06b6d4; margin: 0; font-size: 1.6rem;">AIVerse Movies</h2>
    <span style="color: #64748b; font-size: 0.8rem;">Python AI Recommender Engine</span>
</div>
""", unsafe_allow_html=True)

nav_selection = st.sidebar.radio(
    "NAVIGATION HUB",
    ["1. Popularity Charts", "2. AI Recommender Console", "3. Step-by-Step Math Inspector", "4. Advanced Deep Learning Upgrades"]
)

# PAGE 1: Popularity Charts
if nav_selection == "1. Popularity Charts":
    st.markdown("## 📈 Popularity-Based Recommendations")
    st.markdown("Explore high-rated and trending movies compiled by aggregating relational user ratings.")
    
    top_popular = top_popular_movies(df, 8)
    
    col1, col2 = st.columns([1.2, 1])
    
    with col1:
        st.markdown("""
        <div class="glass-card glass-card-glow-cyan">
            <h3 style="margin-top:0;">Top Trending Movie Rankings</h3>
            <p style="color:#94a3b8; font-size:0.85rem;">Combined Score formula: Rating (Relational average) * 70% + Popularity (Reviews count) * 30%</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Call visualization module
        fig = plot_popularity_bar(top_popular)
        st.pyplot(fig)
        
    with col2:
        st.markdown("### Top List Metrics")
        for i, row in top_popular.iterrows():
            st.markdown(f"""
            <div class="glass-card" style="padding:12px; margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="font-size:0.95rem;">{row['title']} ({row['release_year']})</strong>
                    <span class="neon-text-cyan" style="font-size:0.85rem;">Score: {row['combined_score']:.2f}</span>
                </div>
                <div style="margin-top:6px; display:flex; gap:16px; font-size:0.8rem; color:#94a3b8;">
                    <span>⭐ Rating: {row['rating']}</span>
                    <span>🔥 Popularity: {row['popularity']}%</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

    # 4. Rating Correlation Heatmap addition
    st.markdown("---")
    col3, col4 = st.columns([1.2, 1])
    with col3:
        st.markdown("""
        <div class="glass-card glass-card-glow-cyan">
            <h3 style="margin-top:0;">Relational Taste Correlation Heatmap</h3>
            <p style="color:#94a3b8; font-size:0.85rem;">Pearson correlation indicating coordinate overlap in rating behaviors between top films.</p>
        </div>
        """, unsafe_allow_html=True)
        
        fig_heatmap = plot_ratings_heatmap(df)
        st.pyplot(fig_heatmap)
    with col4:
        st.markdown("### How Relational Taste Filtering Works")
        st.markdown("""
        While **Content-Based models** inspect movie descriptions keywords, **Collaborative/Relational models** inspect how multiple users rate these items.
        
        *   **Positive Score (red)**: Indicates that users who rated Movie A highly also rated Movie B highly.
        *   **Negative Score (blue)**: Indicates that their ratings were opposite.
        *   **Zero Score (white/grey)**: Means their ratings were completely uncorrelated.
        
        *By analyzing this rating utility matrix correlation, we can recommend films purely on user behavior alignment rather than descriptive keyword matches!*
        """)

# PAGE 2: AI Content Recommender Console
elif nav_selection == "2. AI Recommender Console":
    st.markdown("## 🤖 Content-Based Recommender Console")
    st.markdown("Find movies using Scikit-Learn's TF-IDF descriptions vector space matches.")
    
    selected_title = st.selectbox(
        "SELECT REFERENCE MOVIE",
        df['title'].tolist()
    )
    
    limit = st.slider("NUMBER OF RECOMMENDATIONS", 3, 8, 5)
    
    recommendations = get_recommendations(selected_title, df, cosine_sim, limit)
    
    if recommendations.empty:
        st.warning("Movie not found in vectors list.")
    else:
        col1, col2 = st.columns([1.1, 1])
        
        with col1:
            st.markdown(f"### Top {limit} Recommendations Similar to *{selected_title}*")
            
            for i, row in recommendations.iterrows():
                img_url = get_movie_image_url(row['title'])
                st.markdown(f"""
                <div class="glass-card glass-card-glow-purple" style="display:flex; gap:16px; align-items:center;">
                    <img src="{img_url}" style="width: 80px; height: 110px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;" />
                    <div style="flex:1; min-width:0;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <div>
                                <h4 style="margin:0; font-size:1.15rem; overflow:hidden; text-overflow:ellipsis;">{row['title']}</h4>
                                <span style="color:#64748b; font-size:0.75rem;">Year: {row['release_year']} | Genres: {row['genres'].replace('|', ', ')}</span>
                            </div>
                            <div style="text-align:right; min-width:80px; flex-shrink: 0;">
                                <span class="neon-text-purple" style="font-size:0.95rem;">{row['similarity_percentage']}% Match</span>
                            </div>
                        </div>
                        <p style="color:#94a3b8; font-size:0.8rem; margin:8px 0; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{row['description']}</p>
                        <div style="display:flex; gap:16px; font-size:0.75rem; color:#64748b;">
                            <span>⭐ Rating: {row['rating']}</span>
                            <span>🔥 Popularity: {row['popularity']}%</span>
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
                
        with col2:
            st.markdown("### 2D Projection Space Clusters")
            st.markdown("Visualizing thematic distances in vector space via PCA coordinates.")
            
            # Call visualization module
            fig = plot_coordinate_clusters(df, selected_title, recommendations)
            st.pyplot(fig)
            
            st.info("The coordinate plane simplifies vocabulary descriptors mapping. Grouped nodes share similar plot structures and genres.")

# PAGE 3: Step-by-Step Math Inspector
elif nav_selection == "3. Step-by-Step Math Inspector":
    st.markdown("## 🧮 AI Algorithm Step-by-Step Inspector")
    st.markdown("Deconstruct the Scikit-Learn TF-IDF vector intersections and Cosine Similarity dot product equations.")
    
    col1, col2 = st.columns([1, 1.2])
    
    with col1:
        st.markdown("### Select Movies to Compare")
        movie_a = st.selectbox("MOVIE A", df['title'].tolist(), index=0)
        movie_b = st.selectbox("MOVIE B", df['title'].tolist(), index=1)
        
        if movie_a == movie_b:
            st.warning("Please choose two different movies to compute similarity profiles.")
        else:
            score_info = show_similarity_score(movie_a, movie_b, df, vectorizer, tfidf_matrix)
            
            if "error" in score_info:
                st.error(score_info['error'])
            else:
                st.markdown(f"""
                <div class="glass-card glass-card-glow-cyan" style="text-align:center;">
                    <div style="font-size:2.8rem; font-weight:900; color:#06b6d4; line-height:1;">
                        {score_info['percentage']}%
                    </div>
                    <span style="font-size:0.75rem; color:#94a3b8; font-weight:bold; letter-spacing:0.05em; text-transform:uppercase;">
                        COSINE MATCH SCORE
                    </span>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown("#### Mathematical Coordinates Breakdown")
                
                # Render utility math HTML template
                math_html = get_math_explanation_html(
                    score_info['dot_product'],
                    score_info['magnitude_a'],
                    score_info['magnitude_b'],
                    score_info['cosine_score'],
                    score_info['percentage']
                )
                st.markdown(math_html, unsafe_allow_html=True)

    with col2:
        st.markdown("### Common Vector Coordinates (Intersecting Vocabulary)")
        st.markdown("These unique dictionary words occurred in both descriptions. Overlapping uncommon terms score higher weights.")
        
        if movie_a != movie_b and 'shared_terms' in score_info:
            shared = score_info['shared_terms']
            if len(shared) == 0:
                st.info("No shared vocabulary coordinates! The match ratio is 0%.")
            else:
                shared_df = pd.DataFrame(shared)
                shared_df.columns = ["Vocabulary Word", "Weight A", "Weight B", "Product (A * B)"]
                
                shared_df["Weight A"] = shared_df["Weight A"].map(lambda x: f"{x:.4f}")
                shared_df["Weight B"] = shared_df["Weight B"].map(lambda x: f"{x:.4f}")
                shared_df["Product (A * B)"] = shared_df["Product (A * B)"].map(lambda x: f"{x:.6f}")
                
                st.dataframe(shared_df.head(10), hide_index=True, use_container_width=True)
                st.markdown("<span style='font-size:0.75rem; color:#64748b;'>Showing top 10 most influential matching words.</span>", unsafe_allow_html=True)
        
        # Render utility pipeline diagram
        st.markdown("---")
        st.markdown("### AI Computation pipeline")
        st.markdown(get_pipeline_html(), unsafe_allow_html=True)

# PAGE 4: Advanced Deep Learning Upgrades
elif nav_selection == "4. Advanced Deep Learning Upgrades":
    st.markdown("## 🔮 Future AI Upgrades & Deep Learning Paradigm")
    st.markdown("Discover how modern web portals scale standard vector algorithms into deep learning architectures.")

    col1, col2 = st.columns([1.1, 1])

    with col1:
        st.markdown("""
        <div class="glass-card glass-card-glow-purple">
            <h3 style="margin-top:0; color:var(--primary-neon);">Continuous Taste Embeddings</h3>
            <p style="color:#94a3b8; font-size:0.85rem; line-height:1.5;">
                In the TF-IDF model, words are represented as sparse indexes in a massive dictionary coordinate map. 
                However, a standard search engine does not know that <strong>"space"</strong> and <strong>"universe"</strong> are conceptually identical—it only checks matching characters.
            </p>
            <p style="color:#94a3b8; font-size:0.85rem; line-height:1.5;">
                Modern <strong>Deep Learning systems</strong> automatically learn low-dimensional, continuous vectors called <strong>Embeddings</strong>. 
                By mapping items into a dense latent space (e.g. 64 hidden dimensions), the model automatically learns abstract semantic definitions (e.g., that "cyberpunk" correlates with "neon neon lights").
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("### Multi-Layer Neural Collaborators (NCF)")
        st.markdown("""
        A Neural Collaborative Filtering model combines user embeddings and item embeddings inside continuous hidden layers:
        1.  **Input Layer**: Feeds sparse user IDs and movie IDs.
        2.  **Embedding Matrix**: Maps IDs into dense, low-dimensional coordinate spaces.
        3.  **Multi-Layer Perceptron (MLP)**: Performs dense weights multiplications to discover highly non-linear taste vectors interactions.
        4.  **Sigmoid Activation**: Outputs a final predicted rating likelihood score.
        """)

    with col2:
        st.markdown("""
        <div class="glass-card">
            <h3 style="margin-top:0;">Industrial Real-World Applications</h3>
            <div style="display:flex; flex-direction:column; gap:12px; margin-top:10px;">
                <div style="border-left:3px solid var(--secondary-neon); padding-left:12px;">
                    <strong>🎬 Netflix (Personalized Artwork)</strong>
                    <span style="font-size:0.8rem; color:#94a3b8; display:block;">Uses contextual multi-armed bandits to select movie thumbnails that match your vector preferences.</span>
                </div>
                <div style="border-left:3px solid var(--primary-neon); padding-left:12px;">
                    <strong>🎵 Spotify (Discover Weekly)</strong>
                    <span style="font-size:0.8rem; color:#94a3b8; display:block;">Blends Word2Vec music embeddings and CNN audio spectrogram maps to match playlist transitions.</span>
                </div>
                <div style="border-left:3px solid var(--accent-neon); padding-left:12px;">
                    <strong>📦 Amazon (Frequently Bought Together)</strong>
                    <span style="font-size:0.8rem; color:#94a3b8; display:block;">Leverages real-time graph neural networks (GNNs) analyzing purchase sequences.</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("### Neural Network Concept Diagram")
        st.markdown("""
        ```
         User ID  ──> [ User Embedding ] ──┐
                                         ├──> [ MLP Hidden Layer ] ──> Predicted Match
         Movie ID ──> [ Movie Embedding ] ─┘
        ```
        """)
