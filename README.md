# ReziForge - AI Resume Builder & ATS Tailoring Engine

ReziForge is a full-stack, minimalist ATS resume optimization platform. It parses resumes into structured, human-editable fields, dynamically enhances bullet points and summaries against specific target roles (Software Engineering or MBA/Business Leadership) and Job Descriptions, and provides real-time side-by-side template preview and ATS PDF generation.

---

## 🏗️ Architecture

```
ReziForge/
├── Backend/                 # FastAPI REST API & LLM Handler
│   ├── main.py              # API routes & CORS setup
│   ├── src/
│   │   ├── config/          # Settings & logging
│   │   ├── models/          # Pydantic data schemas (TailoredResume)
│   │   └── utils/           # LLM handler, prompt engineering, Playwright PDF generator
│   └── ...
└── Frontend/                # Vite + React Minimalist UI
    ├── src/
    │   ├── components/      # LandingPage, UploadPage, ResumeEditor, ResumePreview, EnhanceModal
    │   ├── App.jsx          # App flow & state synchronization
    │   └── index.css        # Minimalist theme & print styles
    └── ...
```

---

## 🎨 Minimalist Design Palette
- `#ccd5ae` (Soft Olive)
- `#e9edc9` (Pale Pistachio)
- `#fefae0` (Warm Cream)
- `#faedcd` (Warm Sand)
- `#d4a373` (Warm Terracotta)

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd Backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt  # or install fastapi uvicorn pydantic requests playwright jinja2
playwright install chromium
python main.py
```
Backend runs on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.
