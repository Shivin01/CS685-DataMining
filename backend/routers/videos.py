from typing import Any
import random

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

    user_responses = db.query(UserResponse.video_id).filter(UserResponse.user_id == user.user_id).all()
    print('user_responses', user_responses)
    responded_video_ids = [response.video_id for response in user_responses]
    print(responded_video_ids, 'responded_video_ids')

    available_videos = db.query(Video).filter(Video.video_id.notin_(responded_video_ids)).all()
    print(available_videos, 'available_videos')

    if not available_videos:
        raise HTTPException(status_code=404, detail="No available videos for this user.")

    next_video = random.choice(available_videos)

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
