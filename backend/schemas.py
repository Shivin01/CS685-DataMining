from br_dept import branches, departments
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    age: int | None
    department: str | None = Field(None, description="Department number")
    branch: str | None = Field(None, description="Branch number")

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class SubmitResponse(BaseModel):
    video_id: int
    is_real: bool
    reason: str
