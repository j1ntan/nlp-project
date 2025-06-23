#  AI-Powered Question Paper Generator (NLP Project)

🔗 **Live Demo:** [nlp-project.vercel.app](https://nlp-project-07-p834.vercel.app)

---

##  Overview

This project is a **Proof of Concept (POC)** for an AI-powered assistant that automatically generates question papers from provided subject material using **Natural Language Processing (NLP)**.

Teachers often spend hours manually framing question papers. This app reduces that effort by allowing educators to input chapter content, configure marks distribution, and instantly get categorized questions. Each generated session is saved locally for quick access.

---

##  How to Use

1. **Paste** your source content (chapter, topic, notes) in the text area.
2. **Set** the number of 1-mark and 2-mark questions using the input fields.
3. Click **“Generate Questions”** to get an AI-generated question paper.
4. View previously generated question papers under **“Session History”** in the sidebar.
5. Each generation is categorized by marks and stored locally for up to 5 sessions.

---

##  How to Run Locally

```bash
# Clone the repository
git clone https://github.com/j1ntan/nlp-project.git

# Navigate into the project folder
cd nlp-project

# Install dependencies
npm install

# Create .env file with your OpenRouter/HuggingFace API key
echo "VITE_OPENROUTER_API_KEY=your_api_key_here" > .env.local

# Start the development server
npm run dev

