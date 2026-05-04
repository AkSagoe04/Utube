from sqlmodel import SQLModel, create_engine, Session, Field, Relationship
from typing import List, Optional
from datetime import datetime

DATABASE_URL = "postgresql://postgres:password@localhost/utube"

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    videos: List["Video"] = Relationship(back_populates="owner")
    comments: List["Comment"] = Relationship(back_populates="user")
    likes: List["Like"] = Relationship(back_populates="user")

class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    views: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    owner_id: int = Field(foreign_key="user.id")
    owner: User = Relationship(back_populates="videos")
    comments: List["Comment"] = Relationship(back_populates="video")
    likes: List["Like"] = Relationship(back_populates="video")

class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="comments")
    video_id: int = Field(foreign_key="video.id")
    video: Video = Relationship(back_populates="comments")

class Like(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    video_id: int = Field(foreign_key="video.id", primary_key=True)
    is_dislike: bool = Field(default=False)

    user: User = Relationship(back_populates="likes")
    video: Video = Relationship(back_populates="likes")
