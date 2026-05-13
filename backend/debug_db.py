from sqlmodel import Session, create_engine, text
import os

DATABASE_URL = "postgresql://postgres:password@localhost/uTube"
engine = create_engine(DATABASE_URL)

def check():
    try:
        with Session(engine) as session:
            print("--- Database Connection ---")
            session.execute(text("SELECT 1"))
            print("Connected successfully!")
            
            print("\n--- Tables ---")
            result = session.execute(text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"))
            tables = [row[0] for row in result]
            print(f"Tables found: {tables}")
            
            for table in tables:
                print(f"\n--- Columns in {table} ---")
                result = session.execute(text(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}'"))
                for row in result:
                    print(f"  {row[0]}: {row[1]}")
                    
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
