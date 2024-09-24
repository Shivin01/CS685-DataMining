from br_dept import branches, departments
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    age: int
    department: int | None = Field(None, description="Department number")
    branch: int | None = Field(None, description="Branch number")

    @field_validator("email")
    def validate_email_domain(cls, value: str) -> str:
        allowed_domains: list[EmailStr] = ["iitk.ac.in", "cse.iitk.ac.in"]
        email_domain: EmailStr = value.split("@")[-1]
        if email_domain not in allowed_domains:
            raise ValueError(
                f"Email domain must be one of {', '.join(allowed_domains)}"
            )
        return value

    @field_validator("department")
    def convert_department(cls, value: int) -> str:
        if value in departments:
            return departments[value]
        raise ValueError(
            f"Invalid department number: {value}. Valid departments are: {departments}"
        )

    @field_validator("branch")
    def convert_branch(cls, value: int) -> str:
        if value in branches:
            return branches[value]
        raise ValueError(
            f"Invalid branch number: {value}. Valid branches are: {branches}"
        )

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class SubmitResponse(BaseModel):
    video_id: int
    is_real: bool
    reason: str | None = None
