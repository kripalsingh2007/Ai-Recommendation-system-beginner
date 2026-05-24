# AIVerse Movies - Smart Streamlit Wrapper
# This wrapper executes the modular app/streamlit_app.py dashboard seamlessly,
# ensuring compatibility with root-level runs and cloud deployments (e.g., Streamlit Community Cloud).

import os
import sys

# Get absolute paths
root_dir = os.path.dirname(os.path.abspath(__file__))
target_app = os.path.join(root_dir, 'app', 'streamlit_app.py')

# Ensure the root directory is in sys.path so that modular imports (src.*) work perfectly
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Read and execute target application in an updated global context
if os.path.exists(target_app):
    with open(target_app, 'r', encoding='utf-8') as f:
        code = f.read()
    
    # Run the script with __file__ bound to target_app to preserve path resolutions
    exec(code, {**globals(), '__file__': target_app})
else:
    import streamlit as st
    st.error(f"Target Streamlit application not found at: {target_app}")

