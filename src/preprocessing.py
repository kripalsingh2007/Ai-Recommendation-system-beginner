# AIVerse Movies - Preprocessing Sub-Module
# Contains standard natural language text cleaning, stopword filters, and metadata feature merging.

import re

# Standard English stopwords to filter out from tokenized text
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
    "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
    "it", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not",
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
    "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
    "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
    "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "weren't",
    "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
    "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
    "your", "yours", "yourself", "yourselves"
}

def clean_and_normalize_text(text):
    """
    Lowercase the text, remove punctuation, and strip multiple spaces.
    """
    if not isinstance(text, str):
        return ""
    # Convert to lowercase
    text = text.lower().strip()
    # Remove punctuation
    text = re.sub(r'[^\w\s-]', '', text)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text

def filter_stopwords(text):
    """
    Split the text into words and remove common stopwords.
    """
    cleaned_text = clean_and_normalize_text(text)
    words = cleaned_text.split(' ')
    filtered_words = [word for word in words if word and word not in STOPWORDS]
    return ' '.join(filtered_words)

def build_combined_features(df):
    """
    Merges genre keywords and plot descriptions into a boosted composite feature vector string.
    """
    # Create copy to avoid mutating source dataframe
    df_processed = df.copy()
    
    # 1. Clean genres (replace pipes with space)
    df_processed['genres_clean'] = df_processed['genres'].apply(
        lambda x: x.replace('|', ' ').lower() if isinstance(x, str) else ""
    )
    
    # 2. Clean and filter descriptions
    df_processed['desc_clean'] = df_processed['description'].apply(filter_stopwords)
    
    # 3. Create composite vector (repeating genres twice to increase keyword weights in TF-IDF matrix)
    df_processed['combined_features'] = (
        df_processed['genres_clean'] + ' ' + 
        df_processed['genres_clean'] + ' ' + 
        df_processed['desc_clean']
    )
    
    return df_processed
