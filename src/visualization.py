# AIVerse Movies - Visualization Sub-Module
# Contains standard encapsulated Matplotlib and Seaborn plotting methods for the Streamlit dashboard.

import matplotlib.pyplot as plt
import seaborn as sns

# Curated 2D projection coordinates representing thematic similarity clusters
THEMATIC_COORDINATES = {
    1: (180, 320, '#06b6d4'), 2: (140, 280, '#06b6d4'), 3: (220, 360, '#06b6d4'),
    4: (100, 300, '#06b6d4'), 5: (80,  340, '#06b6d4'), 6: (200, 270, '#06b6d4'),
    7: (150, 120, '#ec4899'), 8: (220, 100, '#ec4899'), 9: (420, 80,  '#22c55e'),
    10: (480, 120, '#22c55e'), 11: (150, 380, '#06b6d4'), 12: (380, 140, '#22c55e'),
    13: (440, 280, '#a855f7'), 14: (380, 320, '#a855f7'), 15: (480, 340, '#a855f7'),
    16: (340, 350, '#a855f7'), 17: (110, 240, '#06b6d4'), 18: (250, 230, '#06b6d4'),
    19: (290, 290, '#a855f7'), 20: (280, 90,  '#ec4899'), 21: (340, 190, '#22c55e'),
    22: (90,  110, '#ec4899'), 23: (390, 240, '#a855f7'), 24: (490, 270, '#a855f7'),
    25: (260, 380, '#06b6d4')
}

def plot_popularity_bar(df_popular):
    """
    Renders a stunning horizontal Seaborn bar chart showing popularity rankings.
    """
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(8, 4.5))
    fig.patch.set_facecolor('#060814')
    ax.set_facecolor('#0a0e22')
    
    sns.barplot(
        data=df_popular,
        x='combined_score',
        y='title',
        palette='cool',
        ax=ax,
        hue='title',
        legend=False
    )
    
    # Custom aesthetic overrides
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#22253a')
    ax.spines['bottom'].set_color('#22253a')
    ax.xaxis.grid(True, color='#22253a', linestyle=':', alpha=0.5)
    ax.yaxis.grid(False)
    
    ax.set_xlabel('Combined Popularity Rating (Scale 0-10)', fontsize=10, color='#94a3b8')
    ax.set_ylabel('', fontsize=10)
    ax.tick_params(colors='#94a3b8', labelsize=9)
    
    plt.tight_layout()
    return fig

def plot_coordinate_clusters(df, selected_title, recommendations_df):
    """
    Projects all movies onto a 2D plane and links recommended items with neon grids.
    """
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('#060814')
    ax.set_facecolor('#0a0e22')
    
    # Retrieve target movie details
    target_series = df[df['title'] == selected_title]
    if target_series.empty:
        return fig
        
    target_id = target_series['movieId'].values[0]
    tx, ty, tcolor = THEMATIC_COORDINATES[target_id]
    
    # Extract recommendations IDs
    rec_ids = recommendations_df['movieId'].tolist() if not recommendations_df.empty else []
    
    # Plot all coordinate nodes
    for mid, (x, y, color) in THEMATIC_COORDINATES.items():
        is_target = (mid == target_id)
        is_recommendation = (mid in rec_ids)
        
        if is_target:
            # Anchor movie: Large glowing circle with text label
            ax.scatter(x, y, color='#06b6d4', s=160, edgecolor='white', linewidth=2, zorder=10)
            ax.text(x + 10, y + 6, selected_title, fontsize=8, fontweight='bold', color='white', zorder=11)
        elif is_recommendation:
            # Matches: Glowing purple circles with dashed line links
            ax.scatter(x, y, color='#a855f7', s=100, zorder=8)
            ax.plot([tx, x], [ty, y], color='#a855f7', alpha=0.35, linestyle='--', linewidth=1.5, zorder=2)
        else:
            # Standby: translucent nodes
            ax.scatter(x, y, color='#ffffff', alpha=0.12, s=30, zorder=5)
            
    ax.set_xlim(0, 550)
    ax.set_ylim(0, 450)
    
    # Styling grids
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#22253a')
    ax.spines['bottom'].set_color('#22253a')
    ax.xaxis.grid(True, color='#22253a', linestyle=':', alpha=0.3)
    ax.yaxis.grid(True, color='#22253a', linestyle=':', alpha=0.3)
    
    # Hide raw ticks numbers for visual clean coordinates
    ax.set_xticklabels([])
    ax.set_yticklabels([])
    plt.title('Multi-Dimensional Vector Projections', color='#94a3b8', fontsize=10, pad=10)
    
    plt.tight_layout()
    return fig

def plot_ratings_heatmap(df):
    """
    Renders a stunning movie-to-movie user rating correlation heatmap using ratings.csv.
    """
    import pandas as pd
    try:
        # Load reviews history
        ratings_df = pd.read_csv("data/ratings.csv")
        
        # Pivot to create a user-item utility ratings matrix
        utility_matrix = ratings_df.pivot(index='userId', columns='movieId', values='rating')
        
        # Select top 7 popular movies by review count to keep heatmap clean and highly visible
        popular_mids = ratings_df['movieId'].value_counts().head(7).index.tolist()
        sub_utility = utility_matrix[popular_mids]
        
        # Rename columns to movie titles
        title_map = dict(zip(df['movieId'], df['title']))
        sub_utility = sub_utility.rename(columns=title_map)
        
        # Compute Pearson correlation matrix
        corr_matrix = sub_utility.corr(method='pearson').fillna(0)
        
        # Plot Seaborn heatmap
        plt.style.use('dark_background')
        fig, ax = plt.subplots(figsize=(6, 5))
        fig.patch.set_facecolor('#060814')
        ax.set_facecolor('#0a0e22')
        
        sns.heatmap(
            corr_matrix, 
            annot=True, 
            cmap='coolwarm', 
            vmin=-1, 
            vmax=1, 
            center=0,
            ax=ax,
            cbar=False,
            annot_kws={"size": 9, "fontweight": "bold"}
        )
        
        ax.tick_params(colors='#94a3b8', labelsize=8)
        plt.title('Relational Ratings User Taste Correlation', color='#94a3b8', fontsize=10, pad=12)
        plt.tight_layout()
        return fig
    except Exception as e:
        # Fallback empty figure if ratings.csv is missing
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, "Ratings Heatmap Unavailable", ha='center', va='center')
        return fig
