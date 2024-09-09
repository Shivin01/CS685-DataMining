from database import Base, engine
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from routers import auth

app = FastAPI()
app.include_router(auth.router)

# Create database tables
Base.metadata.create_all(bind=engine)

# OAuth2 password bearer scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@app.get("/")
def root():
    return {"message": "Welcome to the Deepfake Detection API"}


@app.get("/protected", tags=["Protected"], dependencies=[Depends(oauth2_scheme)])
async def protected_route():
    return {"message": "This is a protected route"}
