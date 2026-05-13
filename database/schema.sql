-- Utube Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_username ON "user"(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);

-- Videos Table
CREATE TABLE IF NOT EXISTS video (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    video_id INTEGER REFERENCES video(id) ON DELETE CASCADE
);

-- Likes Table (Handles both likes and dislikes)
CREATE TABLE IF NOT EXISTS "like" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    video_id INTEGER REFERENCES video(id) ON DELETE CASCADE,
    is_dislike BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, video_id)
);
