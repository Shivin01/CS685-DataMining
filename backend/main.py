from database import Base, engine
from fastapi import FastAPI
from routers.users import router as user_router

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Welcome to the Deepfake Detection API"}
