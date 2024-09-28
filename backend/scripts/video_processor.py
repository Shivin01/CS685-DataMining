import json
import logging
import os
import zipfile
from datetime import datetime

from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    create_engine,
    func,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection details
DB_USER = "postgres"
DB_PASS = "postgres"
DB_URI = "0.0.0.0"
DB_NAME = "deepfake_db"

# Set up logging
logging.basicConfig(filename="missing_files.log", level=logging.INFO)

# SQLAlchemy setup
Base = declarative_base()
engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_URI}/{DB_NAME}")
Session = sessionmaker(bind=engine)
session = Session()


# Define the Video model
class Video(Base):
    __tablename__: str = "videos"

    video_id = Column(Integer, primary_key=True, index=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    video_title = Column(String, nullable=False)
    video_url = Column(String, nullable=False)
    is_real = Column(Boolean, nullable=False)
    original_id = Column(Integer, ForeignKey("videos.video_id"), nullable=True)


# Create the video table if it doesn't exist
# Base.metadata.create_all(engine)


def extract_zip(zip_path):
    """Extract zip file to a temporary folder."""
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        extract_path = zip_path.replace(".zip", "")
        zip_ref.extractall(extract_path)
    return extract_path


def find_videos(folder_path):
    """Find all video files in the given folder."""
    videos = {}
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith((".mp4")):
                videos[file] = os.path.join(root, file)
    return videos


def find_metadata(folder_path):
    """Find metadata file in the given folder."""
    metadata = ""
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file == "metadata.json":  # Add more formats if needed
                metadata = os.path.join(root, file)
    return metadata


def load_metadata(metadata_path):
    """Load metadata from a JSON file."""
    with open(metadata_path, "r") as f:
        return json.load(f)


def process_files(input_path):
    """Process the input folder or zip file."""
    if input_path.endswith(".zip"):
        folder_path = extract_zip(input_path)
    else:
        folder_path = input_path

    # Look for metadata file
    metadata_path = find_metadata(folder_path)
    print(metadata_path)
    if not os.path.exists(metadata_path):
        logging.error("Metadata file not found.")
        return

    metadata = load_metadata(metadata_path)
    videos = find_videos(folder_path)

    for video_name, details in metadata.items():
        if video_name in videos:
            new_video = Video(
                video_title=video_name,
                video_url=f"videos/{video_name}",
                is_real=details["label"] == "REAL",
                # FIXME: Original video ID: In case original video is not already in the DB,
                # how to handle such cases.
                # original_id=details.get("original"),
            )
            session.add(new_video)
        else:
            logging.info(f"Missing video: {video_name}")

    session.commit()
    session.close()


if __name__ == "__main__":
    # input_path = input("Enter the path to the folder or zip file: ")
    input_path = "./selected_videos"
    process_files(input_path)
