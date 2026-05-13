from sqlmodel import Session, create_engine, text
import sys

DATABASE_URL = "postgresql://postgres:password@localhost/uTube"
engine = create_engine(DATABASE_URL)

try:
    with Session(engine) as session:
        # Try a simple select
        result = session.execute(text("SELECT 1"))
        print("Database connection successful!")
except Exception as e:
    print(f"Database connection failed: {e}")
    sys.exit(1)
