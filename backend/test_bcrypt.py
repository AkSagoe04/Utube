from passlib.context import CryptContext
import bcrypt

print(f"Bcrypt version: {bcrypt.__version__}")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    h = pwd_context.hash("password123")
    print(f"Hashed: {h}")
    v = pwd_context.verify("password123", h)
    print(f"Verified: {v}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
