# Intrusion Detection System (IDS) using Machine Learning

A complete, production-quality educational cybersecurity project. This project implements a real, functional ML-based Intrusion Detection System (IDS) that analyzes network traffic features, classifies them using a trained Random Forest model, and provides a professional Security Operations Center (SOC) dashboard.

## Features
- **Real ML Predictions**: Uses a `RandomForestClassifier` trained on the UNSW-NB15 network intrusion dataset.
- **REST API Backend**: High-performance FastAPI backend with SQLite logging.
- **SOC Dashboard**: Next.js (React) dashboard with live traffic analysis, alerts, and model performance metrics.
- **Detection Lab**: Manually inject synthetic traffic features to observe real-time model predictions.
- **Alert Management**: Severity engine that categorizes attacks and generates actionable alerts.

## Technology Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Recharts, Lucide React
- **Backend**: Python, FastAPI, Uvicorn, SQLAlchemy, SQLite
- **Machine Learning**: scikit-learn, Pandas, NumPy, joblib

## Project Architecture
- `backend/`: FastAPI application, SQLite database models, ML pipeline, and APIs.
- `frontend/`: Next.js application, React components, and Tailwind styling.

## Ethical/Legal Considerations
This system is intended for **authorized security testing and educational use in controlled environments**. It is a defensive tool meant to analyze traffic and educate users on ML applications in cybersecurity. It does not perform active network scanning, packet sniffing, or offensive actions.

---

## How to Install & Run

### 1. Setup Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # (Windows)
# source venv/bin/activate # (Mac/Linux)
pip install -r requirements.txt
```

### 2. Download Dataset & Train Model
You must train the model before running predictions.
```bash
# Inside the backend directory with venv activated
python datasets/download_dataset.py
python -m ml.train
```

### 3. Run FastAPI Backend
```bash
# Inside the backend directory
uvicorn main:app --reload --port 8001
```
The API will be available at `http://localhost:8001`.

### 4. Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

### 5. Run Tests
```bash
# Inside the backend directory
$env:PYTHONPATH="."
pytest tests/test_api.py
```
