from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import SQLModel, Session, select
from models import engine, User, Video, Comment, Like, get_session, UserCreate
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from typing import List
import os
import shutil

# Main FastAPI application instance
app = FastAPI(title="Utube API")

# Configure Cross-Origin Resource Sharing (CORS)
# This allows the frontend (Vite/React) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory where uploaded video files will be stored
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Startup event: Creates all database tables defined in models.py
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# Helper route to view the database schema (useful for debugging)
# Helper route to view the database schema (useful for debugging)
@app.get("/api/schema")
def get_schema():
    schema_path = os.path.join("..", "database", "schema.sql")
    if os.path.exists(schema_path):
        with open(schema_path, "r") as f:
            return {"schema": f.read()}
    return {"error": "Schema file not found"}

@app.get("/api/check-db")
def check_db(session: Session = Depends(get_session)):
    try:
        from sqlmodel import text
        session.execute(text("SELECT 1"))
        return {
            "status": "online",
            "message": "Database connection successful",
            "database": "PostgreSQL (uTube)"
        }
    except Exception as e:
        return {
            "status": "offline",
            "message": str(e),
            "database": "PostgreSQL (uTube)"
        }

@app.get("/")
def read_root():
    return {"message": "Welcome to Utube API"}

# --- Authentication Routes ---

# User Registration: Hashes password and saves user to DB
@app.post("/signup")
def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.username == user_in.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Create new user object with hashed password
    user = User(
        username=user_in.username,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password)
    )
    session.add(user)
    session.commit()   # Save to DB
    session.refresh(user) # Get the generated ID
    return {"message": "User created successfully"}

# Login / Token Generation: Verifies credentials and returns JWT
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Video Routes ---

# Fetch all videos from the database
@app.get("/videos", response_model=List[Video])
def get_videos(session: Session = Depends(get_session)):
    videos = session.exec(select(Video)).all()
    return videos

# Upload a new video (requires authentication)
@app.post("/videos/upload")
async def upload_video(
    title: str, 
    description: str = None, 
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user), # Ensures only logged-in users can upload
    session: Session = Depends(get_session)
):
    # Save the file to the local filesystem
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create video record in the database
    video = Video(
        title=title,
        description=description,
        video_url=file_path,
        owner_id=current_user.id
    )
    session.add(video)
    session.commit()
    session.refresh(video)
    return video

# Fetch a single video by its ID
@app.get("/videos/{video_id}", response_model=Video)
def get_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
