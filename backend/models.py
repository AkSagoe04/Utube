from sqlmodel import SQLModel, create_engine, Session, Field, Relationship
from typing import List, Optional
from datetime import datetime

# backend/models.py line 5
# Connection string for the PostgreSQL database
# Note: Ensure the database name matches exactly (case-sensitive)
DATABASE_URL = "postgresql://postgres:password@localhost/uTube"

# Create the SQLAlchemy engine that will handle database connections
engine = create_engine(DATABASE_URL)

# Dependency to provide a database session to API endpoints
def get_session():
    with Session(engine) as session:
        yield session

# Shared fields for User model (used for creation and reading)
class UserBase(SQLModel):
    username: str = Field(unique=True, index=True) # Must be unique for login
    email: str = Field(unique=True, index=True)    # Must be unique for contact

# Database table representation for Users
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True) # Primary key with auto-increment
    password_hash: str                                        # Securely hashed password
    avatar_url: Optional[str] = None                          # Profile picture URL
    banner_url: Optional[str] = None                          # Profile banner URL
    created_at: datetime = Field(default_factory=datetime.utcnow) # Auto-set timestamp

    # Relationships to other tables
    videos: List["Video"] = Relationship(back_populates="owner")
    comments: List["Comment"] = Relationship(back_populates="user")
    likes: List["Like"] = Relationship(back_populates="user")

# Model for creating a new user (includes raw password field)
class UserCreate(UserBase):
    password: str

# Database table representation for Videos
class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str                                                # Video title
    description: Optional[str] = None                         # Video description
    video_url: str                                            # URL/Path to the video file
    thumbnail_url: Optional[str] = None                       # URL/Path to the thumbnail
    views: int = Field(default=0)                             # View counter
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Foreign key linking to the User who uploaded the video
    owner_id: int = Field(foreign_key="user.id")
    owner: User = Relationship(back_populates="videos")
    
    # Relationships to comments and likes on this video
    comments: List["Comment"] = Relationship(back_populates="video")
    likes: List["Like"] = Relationship(back_populates="video")

# Database table representation for Comments
class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str                                                 # The comment text content
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Links to the author and the video
    user_id: int = Field(foreign_key="user.id")
    user: User = Relationship(back_populates="comments")
    video_id: int = Field(foreign_key="video.id")
    video: Video = Relationship(back_populates="comments")

# Database table representation for Likes/Dislikes
class Like(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    video_id: int = Field(foreign_key="video.id", primary_key=True)
    is_dislike: bool = Field(default=False)                   # False = Like, True = Dislike

    # Relationships for easy access to user and video data
    user: User = Relationship(back_populates="likes")
    video: Video = Relationship(back_populates="likes")
