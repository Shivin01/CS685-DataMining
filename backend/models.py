from database import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class User(Base):
    __tablename__: str = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    branch = Column(String, nullable=False)

    responses = relationship("UserResponse", back_populates="user")


class Video(Base):
    __tablename__: str = "videos"

    video_id = Column(Integer, primary_key=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    video_title = Column(String, nullable=False)
    video_url = Column(String, nullable=False)
    is_real = Column(Boolean, nullable=False)
    original_id = Column(Integer, ForeignKey("videos.video_id"), nullable=True)

    responses = relationship("UserResponse", back_populates="video")
    original_video = relationship("Video", remote_side=[video_id])


class UserResponse(Base):
    __tablename__: str = "user_responses"

    response_id = Column(Integer, primary_key=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.video_id"), nullable=False)
    is_real = Column(Boolean, nullable=False)
    reason = Column(Text, nullable=True)
    response_time = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="responses")
    video = relationship("Video", back_populates="responses")
