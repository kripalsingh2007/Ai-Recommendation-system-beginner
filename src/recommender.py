# AIVerse Movies - Recommender Sub-Module
# Contains standard modular functions executing content similarity models and popularity calculations.

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from src.preprocessing import build_combined_features

# Global caching variables for CLI / quick reference imports
df_global = None
tfidf_matrix_global = None
cosine_sim_global = None
vectorizer_global = None

def load_and_clean_data(movies_path="data/movies.csv", ratings_path="data/ratings.csv"):
    """
    Loads both movies and ratings datasets, merges statistical ratings summaries,
    and constructs Scikit-learn TF-IDF vector grids.
    """
    global df_global, tfidf_matrix_global, cosine_sim_global, vectorizer_global
    
    # 1. Load Datasets
    movies_df = pd.read_csv(movies_path)
    try:
        ratings_df = pd.read_csv(ratings_path)
        # Compute real statistical rating averages and reviews counts from ratings.csv
        ratings_summary = ratings_df.groupby('movieId').agg(
            avg_rating=('rating', 'mean'),
            popularity_count=('rating', 'count')
        ).reset_index()
        
        # Merge summary back into main dataset
        df = pd.merge(movies_df, ratings_summary, on='movieId', how='left')
        
        # Fill missing averaged values with the static defaults from movies.csv
        df['rating'] = df['avg_rating'].fillna(df['rating'])
        df['popularity'] = df['popularity_count'].fillna(df['popularity'])
        df = df.drop(columns=['avg_rating', 'popularity_count'])
    except Exception as e:
        # Fallback to pure static data if ratings.csv fails
        df = movies_df.copy()

    # 2. Clean and set fallback bounds
    df['title'] = df['title'].fillna('')
    df['genres'] = df['genres'].fillna('')
    df['description'] = df['description'].fillna('')
    df['rating'] = df['rating'].fillna(7.0).round(2)
    df['popularity'] = df['popularity'].fillna(50.0).round(2)
    df['release_year'] = df['release_year'].fillna(2000).astype(int)

    # 3. Clean Text and Build Combined Features
    df = build_combined_features(df)

    # 4. Perform TF-IDF Vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['combined_features'])

    # 5. Compute Cosine Similarity Matrix
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Caching globally for default function queries
    df_global = df
    vectorizer_global = vectorizer
    tfidf_matrix_global = tfidf_matrix
    cosine_sim_global = cosine_sim

    return df, vectorizer, tfidf_matrix, cosine_sim

def top_popular_movies(df=None, n=5):
    """
    Rank movies by combining rating and views count:
    Formula: CombinedScore = Rating * 0.7 + (NormalizedPopularity) * 0.3
    """
    if df is None:
        df = df_global
    if df is None:
        raise ValueError("Core Engine is not initialized. Run load_and_clean_data() first.")

    df_copy = df.copy()
    max_pop = df_copy['popularity'].max() if df_copy['popularity'].max() > 0 else 100
    df_copy['norm_popularity'] = (df_copy['popularity'] / max_pop) * 10
    df_copy['combined_score'] = (df_copy['rating'] * 0.7) + (df_copy['norm_popularity'] * 0.3)
    df_copy['combined_score'] = df_copy['combined_score'].round(2)

    popular = df_copy.sort_values(by='combined_score', ascending=False)
    return popular.head(n)[['movieId', 'title', 'genres', 'rating', 'popularity', 'release_year', 'combined_score']]

def get_recommendations(movie_title, df=None, cosine_sim=None, n=5):
    """
    Recommends similar movies using content vectors cosine comparisons.
    """
    if df is None:
        df = df_global
    if cosine_sim is None:
        cosine_sim = cosine_sim_global
        
    if df is None or cosine_sim is None:
        raise ValueError("Core Engine is not initialized. Run load_and_clean_data() first.")

    # Match title case insensitively
    title_search = movie_title.lower().strip()
    match_indices = df[df['title'].str.lower().str.strip() == title_search].index
    
    if len(match_indices) == 0:
        # Fallback to partial matches
        match_indices = df[df['title'].str.lower().str.contains(title_search)].index
        if len(match_indices) == 0:
            return pd.DataFrame()

    idx = match_indices[0]
    
    # Calculate similarity rankings
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Extract top matching items
    movie_indices = []
    scores = []
    for i, score in sim_scores:
        if i != idx:
            movie_indices.append(i)
            scores.append(score)
        if len(movie_indices) == n:
            break

    recs_df = df.iloc[movie_indices].copy()
    recs_df['similarity_score'] = scores
    recs_df['similarity_percentage'] = [int(round(s * 100)) for s in scores]

    return recs_df[['movieId', 'title', 'genres', 'rating', 'popularity', 'release_year', 'similarity_score', 'similarity_percentage', 'description']]

def find_similar_movies(movie_title, n=5):
    """
    Required API signature wrapper pointing directly to get_recommendations
    """
    return get_recommendations(movie_title, n=n)

def show_similarity_score(movie_title_a, movie_title_b, df=None, vectorizer=None, tfidf_matrix=None):
    """
    Performs specific double vector lookups and extracts matching term intersections.
    """
    if df is None:
        df = df_global
    if vectorizer is None:
        vectorizer = vectorizer_global
    if tfidf_matrix is None:
        tfidf_matrix = tfidf_matrix_global

    if df is None or vectorizer is None or tfidf_matrix is None:
        raise ValueError("Core Engine is not initialized.")

    idx_a = df[df['title'].str.lower().str.strip() == movie_title_a.lower().strip()].index
    idx_b = df[df['title'].str.lower().str.strip() == movie_title_b.lower().strip()].index

    if len(idx_a) == 0 or len(idx_b) == 0:
        return {"error": f"One or both movies '{movie_title_a}' or '{movie_title_b}' not found."}

    idx_a = idx_a[0]
    idx_b = idx_b[0]

    vec_a = tfidf_matrix[idx_a].toarray().flatten()
    vec_b = tfidf_matrix[idx_b].toarray().flatten()
    feature_names = vectorizer.get_feature_names_out()

    dot_product = float(np.dot(vec_a, vec_b))
    magnitude_a = float(np.linalg.norm(vec_a))
    magnitude_b = float(np.linalg.norm(vec_b))
    
    cosine_val = 0.0
    if magnitude_a > 0 and magnitude_b > 0:
        cosine_val = dot_product / (magnitude_a * magnitude_b)

    # Intersection details
    shared = []
    for i in range(len(vec_a)):
        if vec_a[i] > 0 and vec_b[i] > 0:
            shared.append({
                "term": feature_names[i],
                "weight_a": float(vec_a[i]),
                "weight_b": float(vec_b[i]),
                "product": float(vec_a[i] * vec_b[i])
            })
            
    shared = sorted(shared, key=lambda x: x['product'], reverse=True)

    return {
        "movie_a": df.iloc[idx_a]['title'],
        "movie_b": df.iloc[idx_b]['title'],
        "dot_product": dot_product,
        "magnitude_a": magnitude_a,
        "magnitude_b": magnitude_b,
        "cosine_score": cosine_val,
        "percentage": int(round(cosine_val * 100)),
        "shared_terms": shared
    }
