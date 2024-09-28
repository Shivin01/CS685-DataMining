from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from routers import auth, videos
from fastapi import FastAPI, Header, HTTPException, Depends


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth.router)
app.include_router(videos.router)

# Create database tables
Base.metadata.create_all(bind=engine)

# OAuth2 password bearer scheme for token-based authentication
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization header")
    token = authorization.split(" ")[1]
    return token

@app.get("/")
def root():
    return {"message": "Welcome to the Deepfake Detection API"}


@app.get("/protected", tags=["Protected"])
async def protected_route(token: str = Depends(get_token)):
    return {"message": "This is a protected route"}
