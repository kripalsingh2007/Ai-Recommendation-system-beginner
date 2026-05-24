# 🎬 AIVerse Movies | AI-Powered Movie Recommendation System

A beginner-friendly, visually stunning AI Movie Recommendation System designed to introduce vector space models and recommendation math in an interactive, stunning dark-cinematic interface.

```
       AIVerse Movies System Pipeline
┌────────────────┐      ┌─────────────────┐      ┌──────────────────┐
│   User Query   │ ───> │  Text Cleaning  │ ───> │ TF-IDF Weighting │
└────────────────┘      └─────────────────┘      └──────────────────┘
                                                          │
┌────────────────┐      ┌─────────────────┐               ▼
│  Top 5 Cards   │ <─── │   Dot Product   │ <─── ┌──────────────────┐
│  & Visuals     │      │   Cosine Math   │      │ Vector Space Map │
└────────────────┘      └─────────────────┘      └──────────────────┘
```

---

## ✨ Features & Architecture

This repository contains two parallel, high-fidelity platforms utilizing the exact same underlying TF-IDF and Cosine Similarity vector space matching:

### 1. Vite & React Single-Page Application (SPA)
- **Glassmorphism UI**: Beautiful transparent panels, glowing indicators, and neon gradient variables.
- **3D Floating Posters**: CSS-keyframed 3D card tilt and hover effects.
- **SVG Interactive Charts**: Real-time vector coordinate cluster scatter plots, data pipelines flowcharts, and bar-chart comparisons built natively without heavy third-party graphing libraries.

### 2. Python & Streamlit Analytical Engine
- **Relational Ratings Engine**: Evaluates average ratings and popularity metrics by dynamically summarizing relational datasets.
- **Seaborn Data Visualization**: Horizontal popularity ranking distributions.
- **PCA Coordinate Mapping**: Matplotlib projections highlighting selected reference coordinate connections.
- **Arithmetic Math console**: Complete step-by-step dot product arithmetic logs.

---

## 🛠️ Modular Folder Structure

The project has been organized with a clean, modular architecture:

```
AIVerse-Movie-Recommender/
│
├── data/
│   ├── movies.csv             # Curated cinematic metadata
│   └── ratings.csv            # Relational mock user reviews database
│
├── src/
│   ├── preprocessing.py       # Natural language cleaners and tokenizers
│   ├── recommender.py         # Computational similarities and ratings summaries
│   ├── visualization.py       # Encapsulated Seaborn/Matplotlib plotting
│   └── utils.py               # Math LaTeX-HTML templates
│
├── app/
│   └── streamlit_app.py       # Graphical Streamlit web application
│
├── requirements.txt           # Python library index
├── README.md                  # Executive system documentation
└── main.py                    # Terminal CLI entry point script
```

---

## 🚀 Installation & Local Startup

### System Prerequisites
Ensure you have **Node.js** (v16+) and **Python** (3.8+) installed on your machine.

---

### Step 1: Launch the React Single-Page Application (SPA)

Navigate to the project root directory, install npm packages, and start the development server:

```bash
# 1. Install standard Vite & React packages
npm install

# 2. Run the local dev server
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

---

### Step 2: Launch the Python Streamlit App & CLI

Install standard python scientific libraries and trigger the services:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Run the executive Command-Line Interface (CLI)
python main.py "Interstellar"

# 3. Launch the graphical Streamlit app
streamlit run app/streamlit_app.py
```
Open your browser and navigate to the Streamlit local port: `http://localhost:8501`

---

## 🧮 How the AI Recommendation Works

The content recommender models descriptions by projecting words onto a multi-dimensional coordinate space.

### 1. Natural Language Preprocessing
Stopwords (e.g. *"the"*, *"with"*, *"above"*) are filtered. The description text is converted to lower-case, punctuation is removed, and genres are boosted to amplify their weight in similarities comparisons.

### 2. TF-IDF Weighting Vectorizer
- **Term Frequency (TF)**: Calculates the ratio of word frequencies inside a single film summary.
- **Inverse Document Frequency (IDF)**: Ranks word rarity across the entire database. If a word like *"black hole"* appears in only one movie description, its coordinate weight is elevated significantly.

### 3. Cosine Similarity Equation
The algorithm computes the angle between the two movie arrows pointing into high-dimensional space:

$$\text{Similarity}(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \sqrt{\sum_{i=1}^n B_i^2}}$$

- **Dot Product ($A \cdot B$)**: Sum of overlapping word weights.
- **Magnitudes ($||A||$, $||B||$)**: Geometric lengths of summary coordinates.

---

## 💻 Sample CLI Engine Output

Running `python main.py "Interstellar"` triggers these calculations in your terminal:

```
============================================================
      🎬  AIVerse Movies | Terminal AI Recommender Engine  🎬
============================================================
[SYSTEM] Vectorizing movie descriptions corpus...
[SYSTEM] Engine successfully loaded. Indexed 25 cinematic nodes.

[AI CALCULATING] Running multi-dimensional cosine metrics for: 'Interstellar'...

------------------------------------------------------------
 TOP 5 RECOMMENDATIONS SIMILAR TO: INTERSTELLAR
------------------------------------------------------------
 1. Dune: Part Two (2024)
    AI Match: 31% Match | Rating: 8.6 stars
    Plot: Paul Atreides unites with Chani and the Fremen desert...

 2. Avatar: The Way of Water (2022)
    AI Match: 22% Match | Rating: 7.6 stars
    Plot: Jake Sully lives with his newfound family on the...
 
 ...
------------------------------------------------------------
 MATHEMATICAL COHERENCE DECONSTRUCTION: Interstellar ➔ Dune: Part Two
------------------------------------------------------------
 Cosine Similarity Score: 0.309094 (31% match)
 Dot Product (A • B)     : 0.082728
 Magnitude Vector A (||A||): 0.518012
 Magnitude Vector B (||B||): 0.516624

 Top shared coordinate words:
   - 'adventure' (Weight A: 0.1706, Weight B: 0.1701, Product: 0.029029)
   - 'planet' (Weight A: 0.1983, Weight B: 0.1448, Product: 0.028723)
============================================================
```

---

## 🔮 Future Improvements

1. **Collaborative Filtering integration**: Leverage user rating logs (`ratings.csv`) to build user-item matrix factorizations (e.g., SVD, ALS) predicting scores based on user behavior overlap.
2. **Deep Learning Embeddings**: Swap out character-matching TF-IDF representations for pre-trained Transformer embeddings (e.g. Word2Vec, BERT, or OpenAI text-embeddings) to understand conceptual semantics (e.g. recognizing that *"cosmos"* and *"space"* are highly similar).
3. **Hybrid Model Blending**: Formulate combined ranking scores incorporating content similarity, collaborative ratings, and real-time user session popularity.

---

## 🌐 Production Deployment Guide

Deploying the Streamlit application to the web is simple:

1. **Push your code to GitHub**: Ensure `requirements.txt`, `data/`, `src/`, and `app/streamlit_app.py` are committed.
2. **Connect to Streamlit Community Cloud**:
   - Go to [share.streamlit.io](https://share.streamlit.io/) and create an account.
   - Click **"New App"** and select your GitHub repository.
   - Set the Main File Path to: `app/streamlit_app.py`.
3. **Deploy**: Click **"Deploy!"** to get a live URL sharing your recommendation engine with the world!
