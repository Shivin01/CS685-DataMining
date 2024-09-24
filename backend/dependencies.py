# dependencies.py
from auth import verify_token
from database import get_db
from fastapi import Depends, HTTPException, status
from models import User
from sqlalchemy.orm import Session


def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("email")).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
