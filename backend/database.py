from config import DB_NAME, DB_PASS, DB_URI, DB_USER
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL (use environment variables or config file for real-world projects)
SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_URI}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
