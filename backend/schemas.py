from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    age: int
    department: str
    branch: str

    @field_validator("email")
    def validate_email_domain(cls, value: str) -> str:
        allowed_domains: list[EmailStr] = ["iitk.ac.in", "cse.iitk.ac.in"]
        email_domain: EmailStr = value.split("@")[-1]
        if email_domain not in allowed_domains:
            raise ValueError(
                f"Email domain must be one of {', '.join(allowed_domains)}"
            )
        return value

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class SubmitResponse(BaseModel):
    video_id: int
    is_real: bool
    reason: str | None = None
