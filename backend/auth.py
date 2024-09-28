from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, Header
import jwt
from config import JWT_ALGORITHM, JWT_SECRET_KEY


def create_access_token(
    data: dict, expires_delta: timedelta = timedelta(minutes=5256000)
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def get_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization header")
    token = authorization.split(" ")[1]
    return token

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        print(f'payload = {payload}')
        return payload
    except jwt.PyJWTError:
        return None
