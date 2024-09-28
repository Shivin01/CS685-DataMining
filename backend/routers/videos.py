from typing import Any

from dependencies import get_current_user, get_db
from fastapi import APIRouter, Depends, HTTPException
from models import User, UserResponse, Video
from schemas import SubmitResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/videos", tags=["videos"])


@router.get("/get-next-video")
def get_next_video(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> dict[str, Any]:
    # Get the ID of the last video responded to by this user
    last_response: UserResponse | None = (
        db.query(UserResponse)
        .filter(UserResponse.user_id == user.user_id)
        .order_by(UserResponse.response_id.desc())
        .first()
    )

    if last_response:
        next_video_id = last_response.video_id + 1
    else:
        # If no responses, start from the first video
        next_video_id = 1

    # Get the next video based on the next_video_id
    next_video: Video | None = (
        db.query(Video).filter(Video.video_id == next_video_id).first()
    )

    if not next_video:
        raise HTTPException(status_code=404, detail="No more videos available")

    return {
        "video_id": next_video.video_id,
        "video_title": next_video.video_title,
        "video_url": next_video.video_url,
    }


@router.post("/submit-response")
def submit_response(
    response: SubmitResponse,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    # Check if the video exists
    video: Video | None = (
        db.query(Video).filter(Video.video_id == response.video_id).first()
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    # Check if the user has already responded to this video
    existing_response: UserResponse | None = (
        db.query(UserResponse)
        .filter(
            UserResponse.user_id == user.user_id,
            UserResponse.video_id == response.video_id,
        )
        .first()
    )

    if existing_response:
        raise HTTPException(
            status_code=400, detail="Response already submitted for this video"
        )

    # Save the new response to the database
    new_response = UserResponse(
        user_id=user.user_id,
        video_id=response.video_id,
        is_real=response.is_real,
        reason=response.reason,
    )
    db.add(new_response)
    db.commit()

    return {"message": "Response submitted successfully"}
