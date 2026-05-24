# AIVerse Movies - Executive Command-Line Interface
# Serves as the standalone terminal entry point for vector space query calculations.

import sys
from src.recommender import load_and_clean_data, get_recommendations, show_similarity_score

def print_banner():
    """
    Renders a stunning terminal ascii header brand box.
    """
    print("=" * 60)
    print("         AIVerse Movies | Terminal AI Recommender Engine")
    print("=" * 60)

def main():
    print_banner()
    
    # 1. Initialize data index
    print("[SYSTEM] Vectorizing movie descriptions corpus...")
    df, vectorizer, tfidf_matrix, cosine_sim = load_and_clean_data()
    print(f"[SYSTEM] Engine successfully loaded. Indexed {len(df)} cinematic nodes.\n")

    # 2. Get search title from command arguments or user prompt
    if len(sys.argv) > 1:
        query_title = " ".join(sys.argv[1:])
    else:
        print("Available movies catalog preview:")
        preview_titles = df['title'].head(10).tolist()
        for idx, t in enumerate(preview_titles):
            print(f"  {idx + 1}. {t}")
        print("  ...")
        
        try:
            query_title = input("\nEnter a reference movie title from the catalog: ")
        except (KeyboardInterrupt, EOFError):
            print("\nExiting engine.")
            return

    if not query_title.strip():
        query_title = "Interstellar"
        print(f"[INFO] Empty input. Defaulting query path to: '{query_title}'")

    print(f"\n[AI CALCULATING] Running multi-dimensional cosine metrics for: '{query_title}'...")
    
    # 3. Retrieve recommendations
    recs = get_recommendations(query_title, df, cosine_sim, 5)
    
    if recs.empty:
        print(f"[ERROR] Could not find any catalog record matching: '{query_title}'")
        print("Please check your spelling and try again.")
        return

    # 4. Display recommendations
    print("\n" + "-" * 60)
    print(f" TOP 5 RECOMMENDATIONS SIMILAR TO: {query_title.upper()}")
    print("-" * 60)
    
    for idx, (_, row) in enumerate(recs.iterrows()):
        print(f" {idx + 1}. {row['title']} ({row['release_year']})")
        print(f"    AI Match: {row['similarity_percentage']}% Match | Rating: {row['rating']} stars")
        print(f"    Plot: {row['description'][:90]}...")
        print()

    # 5. Display detailed mathematical deconstruction for the top match
    top_match = recs.iloc[0]['title']
    print("-" * 60)
    print(f" MATHEMATICAL COHERENCE DECONSTRUCTION: {query_title} -> {top_match}")
    print("-" * 60)
    
    score_info = show_similarity_score(query_title, top_match, df, vectorizer, tfidf_matrix)
    
    if "error" in score_info:
        print(f"[ERROR] Math breakdown failed: {score_info['error']}")
    else:
        print(f" Cosine Similarity Score: {score_info['cosine_score']:.6f} ({score_info['percentage']}% match)")
        print(f" Dot Product (A * B)     : {score_info['dot_product']:.6f}")
        print(f" Magnitude Vector A (||A||): {score_info['magnitude_a']:.6f}")
        print(f" Magnitude Vector B (||B||): {score_info['magnitude_b']:.6f}")
        
        shared_terms = score_info['shared_terms']
        if len(shared_terms) > 0:
            print("\n Top shared coordinate words:")
            for item in shared_terms[:5]:
                print(f"   - '{item['term']}' (Weight A: {item['weight_a']:.4f}, Weight B: {item['weight_b']:.4f}, Product: {item['product']:.6f})")
        print("=" * 60)

if __name__ == "__main__":
    main()
