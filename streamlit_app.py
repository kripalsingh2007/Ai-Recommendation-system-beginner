# DEPRECATED: This monolithic dashboard has been restructured into clean modular sub-packages.
# Visual Streamlit dashboard now resides in: app/streamlit_app.py

import streamlit as st
st.warning("⚠️ Monolithic root-level streamlit_app.py is deprecated.")
st.info("Please launch the refactored modular application instead:")
st.code("streamlit run app/streamlit_app.py")
