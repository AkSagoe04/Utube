from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import SQLModel, Session, select
from models import engine, User, Video, Comment, Like, get_session
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from typing import List
import os
import shutil

app = FastAPI(title="Utube API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to Utube API"}

# Auth Routes
@app.post("/signup")
def signup(user: User, session: Session = Depends(get_session)):
    user.password_hash = get_password_hash(user.password_hash) # Using password_hash field as password input for simplicity in this MVP
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User created successfully"}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Video Routes
@app.get("/videos", response_model=List[Video])
def get_videos(session: Session = Depends(get_session)):
    videos = session.exec(select(Video)).all()
    return videos

@app.post("/videos/upload")
async def upload_video(
    title: str, 
    description: str = None, 
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
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

@app.get("/videos/{video_id}", response_model=Video)
def get_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
