# routers/auth.py

from auth import create_access_token  # Your JWT utility
from database import get_db
from dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import User
from passlib.context import CryptContext
from schemas import Token, UserCreate
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/signup", response_model=UserCreate)
def create_user(user: UserCreate, db: Session = Depends(get_db)) -> User:
    db_user: User | None = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        password_hash=pwd_context.hash(user.password),
        age=user.age,
        department=user.department,
        branch=user.branch,
    )

    # Add and commit the new user to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token: str = create_access_token(data={"email": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"email": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
