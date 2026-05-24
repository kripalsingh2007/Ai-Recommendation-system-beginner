// A complete client-side TF-IDF + Cosine Similarity recommendation engine.
// Implemented with transparent calculations to fuel educational visualizer modules.

// Standard english stopwords to filter out from tokenized movie descriptions
const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont",
  "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have",
  "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him",
  "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt",
  "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not",
  "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
  "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such",
  "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres",
  "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too",
  "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent",
  "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom",
  "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve",
  "your", "yours", "yourself", "yourselves", "in", "out", "with", "from", "through", "about", "their"
]);

// Helper to tokenize and clean text
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove special characters
    .split(/\s+/)             // split by whitespace
    .filter(word => word.length > 2 && !STOPWORDS.has(word)); // filter short words and stopwords
}

/**
 * Builds the TF-IDF recommendation index from the movie corpus.
 * @param {Array} corpus - Array of movies.
 */
export function buildRecommendationEngine(corpus) {
  // 1. Preprocess each movie and compile vocabulary
  const documents = corpus.map(movie => {
    // Boost genres by duplicating them to give them heavier weight in vector matching
    const genreText = movie.genres.join(" ");
    const keywordText = movie.searchKeywords.join(" ");
    const fullText = `${movie.title} ${genreText} ${genreText} ${movie.description} ${keywordText}`;
    const tokens = tokenize(fullText);
    
    // Count token frequencies (Term Frequency - TF raw counts)
    const termCounts = {};
    tokens.forEach(token => {
      termCounts[token] = (termCounts[token] || 0) + 1;
    });

    return {
      id: movie.id,
      title: movie.title,
      tokens: tokens,
      termCounts: termCounts,
      totalTokens: tokens.length
    };
  });

  // 2. Compute Document Frequency (DF) & build Vocabulary Set
  const vocabulary = new Set();
  const docFrequency = {};

  documents.forEach(doc => {
    Object.keys(doc.termCounts).forEach(term => {
      vocabulary.add(term);
      docFrequency[term] = (docFrequency[term] || 0) + 1;
    });
  });

  // 3. Compute Inverse Document Frequency (IDF) for all words
  // Formula: IDF(t) = ln(1 + (N / (1 + DF(t)))) + 1
  const numDocs = corpus.length;
  const idfs = {};
  vocabulary.forEach(term => {
    idfs[term] = Math.log(1 + (numDocs / (1 + docFrequency[term]))) + 1;
  });

  // 4. Compute TF-IDF Vectors for all documents
  // Vector representation is stored as a map of { term: weight }
  const docVectors = documents.map(doc => {
    const vector = {};
    Object.entries(doc.termCounts).forEach(([term, count]) => {
      const tf = count / doc.totalTokens; // Normalized Term Frequency
      const idf = idfs[term];
      vector[term] = tf * idf;
    });

    // Compute magnitude for vector L2 norms later
    let sumSquares = 0;
    Object.values(vector).forEach(val => {
      sumSquares += val * val;
    });
    const magnitude = Math.sqrt(sumSquares);

    return {
      id: doc.id,
      title: doc.title,
      vector: vector,
      magnitude: magnitude
    };
  });

  return {
    vocabulary: Array.from(vocabulary),
    idfs: idfs,
    docVectors: docVectors,
    numDocs: numDocs
  };
}

/**
 * Calculates Cosine Similarity between a query vector and a movie vector, returning full explanation logs.
 */
export function calculateCosineSimilarity(queryVector, docVector, docMagnitude, idfs) {
  let dotProduct = 0;
  const commonTerms = [];

  // Calculate dot product & gather overlapping terms
  Object.entries(queryVector).forEach(([term, queryWeight]) => {
    if (docVector[term]) {
      const docWeight = docVector[term];
      const product = queryWeight * docWeight;
      dotProduct += product;
      
      commonTerms.push({
        term: term,
        queryWeight: queryWeight,
        docWeight: docWeight,
        product: product,
        idf: idfs[term] || 0
      });
    }
  });

  // Query vector magnitude
  let querySumSquares = 0;
  Object.values(queryVector).forEach(val => {
    querySumSquares += val * val;
  });
  const queryMagnitude = Math.sqrt(querySumSquares);

  // Cosine Similarity Formula: DotProduct / (||Query|| * ||Doc||)
  let score = 0;
  if (queryMagnitude > 0 && docMagnitude > 0) {
    score = dotProduct / (queryMagnitude * docMagnitude);
  }

  // Sort matched terms by their product (importance of match)
  commonTerms.sort((a, b) => b.product - a.product);

  return {
    score: score,
    percentage: Math.round(score * 100),
    dotProduct: dotProduct,
    queryMagnitude: queryMagnitude,
    docMagnitude: docMagnitude,
    commonTerms: commonTerms
  };
}

/**
 * Recommends similar movies for a specific input movie
 */
export function getRecommendationsByMovie(movieId, engine, corpus, limit = 5) {
  const targetDocVector = engine.docVectors.find(v => v.id === movieId);
  if (!targetDocVector) return [];

  const recommendations = [];

  engine.docVectors.forEach(docVec => {
    if (docVec.id === movieId) return; // skip self

    const simResult = calculateCosineSimilarity(
      targetDocVector.vector,
      docVec.vector,
      docVec.magnitude,
      engine.idfs
    );

    const movieDetails = corpus.find(m => m.id === docVec.id);

    recommendations.push({
      movie: movieDetails,
      similarity: simResult
    });
  });

  // Sort by similarity score descending
  return recommendations
    .sort((a, b) => b.similarity.score - a.similarity.score)
    .slice(0, limit);
}

/**
 * Recommends movies matching a free-text search query
 */
export function getRecommendationsByQuery(rawQuery, engine, corpus, limit = 5) {
  const queryTokens = tokenize(rawQuery);
  if (queryTokens.length === 0) return [];

  // Compute Term Frequency for the query
  const queryCounts = {};
  queryTokens.forEach(token => {
    queryCounts[token] = (queryCounts[token] || 0) + 1;
  });

  // Build query TF-IDF vector
  const queryVector = {};
  Object.entries(queryCounts).forEach(([term, count]) => {
    // Only calculate weight if word is in our vocabulary
    const idf = engine.idfs[term];
    if (idf) {
      const tf = count / queryTokens.length;
      queryVector[term] = tf * idf;
    }
  });

  const recommendations = [];

  engine.docVectors.forEach(docVec => {
    const simResult = calculateCosineSimilarity(
      queryVector,
      docVec.vector,
      docVec.magnitude,
      engine.idfs
    );

    const movieDetails = corpus.find(m => m.id === docVec.id);

    recommendations.push({
      movie: movieDetails,
      similarity: simResult
    });
  });

  // Filter out items with 0% match to keep lists clean
  return recommendations
    .filter(rec => rec.similarity.score > 0)
    .sort((a, b) => b.similarity.score - a.similarity.score)
    .slice(0, limit);
}
