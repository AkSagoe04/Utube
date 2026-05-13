from sqlmodel import create_engine, text

DATABASE_URL = "postgresql://postgres:password@localhost/uTube"
engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Migrating database...")
        # Fix Video table
        try:
            conn.execute(text("ALTER TABLE video RENAME COLUMN owner_id TO channel_id;"))
            print("Renamed owner_id to channel_id in video table.")
        except Exception as e:
            print(f"Note: owner_id rename skipped (maybe already done or column missing): {e}")

        try:
            conn.execute(text("ALTER TABLE video DROP CONSTRAINT IF EXISTS video_owner_id_fkey;"))
            conn.execute(text("ALTER TABLE video ADD CONSTRAINT video_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES channel(id) ON DELETE CASCADE;"))
            print("Updated foreign key for video table.")
        except Exception as e:
            print(f"Note: foreign key update skipped: {e}")

        conn.commit()
        print("Migration complete!")

if __name__ == "__main__":
    migrate()
