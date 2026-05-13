import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from models import User, get_session

# Configuration
# Security Configuration
SECRET_KEY = "your-secret-key"  # Key used to sign JWT tokens
ALGORITHM = "HS256"             # Hashing algorithm for JWT
ACCESS_TOKEN_EXPIRE_MINUTES = 30 # Token validity duration

# Define the scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Password Utilities ---

# Check if a plain text password matches the hashed version in DB
def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Hash a password using bcrypt before storing it
def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# --- JWT Token Management ---

# Generate a new JWT token for a user
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency: Decodes the JWT token to identify the currently logged-in user
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using our secret key
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Lookup the user in the database based on the username from the token
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception
    return user # Return the User object for use in endpoints
