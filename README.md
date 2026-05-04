# Utube Clone

A modern YouTube clone built with FastAPI (Python) and React (Vite/Tailwind).

## Tech Stack
- **Backend**: FastAPI, SQLModel (SQLAlchemy), PostgreSQL, JWT Auth.
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons, Axios.

## Getting Started

### Backend
1. Navigate to `backend/`
2. Install dependencies: `pip install -r requirements.txt` (or manually install fastapi, sqlmodel, etc.)
3. Run the server: `uvicorn main:app --reload`
   - *Note: Ensure PostgreSQL is running and the connection string in `models.py` is correct.*

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## Features
- [x] Modern, premium Dark Mode UI
- [x] JWT Authentication (Login/Signup)
- [x] Video Grid with animations
- [x] Video Watch Page with Related Videos
- [x] Video Upload API
