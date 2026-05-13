from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlmodel import SQLModel, Session, select, or_
from models import engine, User, Video, Comment, Like, Channel, ChannelCreate, get_session, UserCreate
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from typing import List, Optional
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

# Beginners: This line tells FastAPI to serve files from the 'uploads' folder 
# so they can be viewed in the browser at http://localhost:8000/uploads/...
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

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
    # Beginners: Before creating a user, we check if the username OR email is already taken
    # This prevents the database from crashing due to duplicate information
    
    # 1. Check if the username already exists
    existing_username = session.exec(select(User).where(User.username == user_in.username)).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="This username is already taken. Please try another one.")
    
    # 2. Check if the email already exists
    existing_email = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="This email is already registered. Try logging in instead.")
    
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
    # Beginners: We now check if the input matches either the 'username' OR the 'email'
    user = session.exec(
        select(User).where(
            or_(User.username == form_data.username, User.email == form_data.username)
        )
    ).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username, email or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- User Profile Route ---

# Beginners: This endpoint allows the frontend to get the current logged-in user's details
@app.get("/users/me")
def get_me(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Check if this user has already created a channel
    channel = session.exec(select(Channel).where(Channel.user_id == current_user.id)).first()
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "has_channel": channel is not None,
        "channel": channel
    }

# --- Channel Routes ---

# Beginners: This allows a user to create their own channel
@app.post("/channels", response_model=Channel)
def create_channel(
    channel_in: ChannelCreate, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    # Ensure the user doesn't already have a channel
    existing_channel = session.exec(select(Channel).where(Channel.user_id == current_user.id)).first()
    if existing_channel:
        raise HTTPException(status_code=400, detail="User already has a channel")
    
    # Create the channel record
    channel = Channel(
        name=channel_in.name,
        description=channel_in.description,
        user_id=current_user.id
    )
    session.add(channel)
    session.commit()
    session.refresh(channel)
    return channel

# Beginners: Get the current user's channel details
@app.get("/channels/me", response_model=Optional[Channel])
def get_my_channel(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    channel = session.exec(select(Channel).where(Channel.user_id == current_user.id)).first()
    return channel

# Beginners: View any channel by its ID
@app.get("/channels/{channel_id}", response_model=Channel)
def get_channel(channel_id: int, session: Session = Depends(get_session)):
    channel = session.get(Channel, channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel

# Beginners: Get all videos uploaded by a specific channel
@app.get("/channels/{channel_id}/videos", response_model=List[Video])
def get_channel_videos(channel_id: int, session: Session = Depends(get_session)):
    videos = session.exec(select(Video).where(Video.channel_id == channel_id)).all()
    return videos

# --- Video Routes ---

# Fetch all videos from the database
@app.get("/videos", response_model=List[Video])
def get_videos(session: Session = Depends(get_session)):
    videos = session.exec(select(Video)).all()
    return videos

# Upload a new video (requires authentication and a channel)
@app.post("/videos/upload")
async def upload_video(
    title: str, 
    description: str = None, 
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Beginners: Before uploading, we check if the user has a channel
    channel = session.exec(select(Channel).where(Channel.user_id == current_user.id)).first()
    if not channel:
        raise HTTPException(status_code=400, detail="You must create a channel before uploading videos")

    # Save the file to the local filesystem
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create video record in the database linked to the user's channel
    video = Video(
        title=title,
        description=description,
        video_url=file_path,
        channel_id=channel.id
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
