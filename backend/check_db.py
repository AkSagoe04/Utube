from sqlmodel import Session, create_engine, text
from models import DATABASE_URL
import sys

def check_connection():
    print(f"--- Database Connection Check ---")
    print(f"Target URL: {DATABASE_URL.replace(DATABASE_URL.split('@')[0], 'postgresql://***:***')}") # Mask credentials
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with Session(engine) as session:
            # Test query
            result = session.execute(text("SELECT 1")).fetchone()
            if result:
                print("\n[SUCCESS] Connection established successfully!")
                print("[INFO] Database is online and responding.")
            else:
                print("\n[WARNING] Connection established, but test query returned no results.")
    except Exception as e:
        print(f"\n[ERROR] Connection failed!")
        print(f"[DETAIL] {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_connection()
