import json
import logging
from datetime import datetime
#
from sqlalchemy import (
    create_engine,
)

import sys
import os

# Add the root directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Database connection details
DB_USER = "postgres"
DB_PASS = "postgres"
DB_URI = "172.27.96.188"
DB_NAME = "deepfake_db"

# Set up logging
logging.basicConfig(filename="missing_files.log", level=logging.INFO)

# SQLAlchemy setup
Base = declarative_base()
engine = create_engine(f"postgresql://{DB_USER}:{DB_PASS}@{DB_URI}:5432/{DB_NAME}")
Session = sessionmaker(bind=engine)
session = Session()

from models import Video

Base.metadata.create_all(engine)

if __name__ == "__main__":
    # input_path = input("Enter the path to the folder or zip file: ")
    Video = session.query(Video).all()


    # Convert each SQLAlchemy object to a dictionary
    def model_to_dict(obj):
        return {column.name: getattr(obj, column.name) for column in obj.__table__.columns}


    # Convert the query result to a list of dictionaries
    user_responses_list = [model_to_dict(response) for response in Video]

    # Convert the list of dictionaries to JSON

    def custom_serializer(obj):
        if isinstance(obj, datetime):
            return obj.isoformat()  # Converts datetime to a string in ISO 8601 format
        raise TypeError(f"Type {type(obj)} not serializable")

    import pandas as pd
    user_responses_json = json.dumps(user_responses_list, default=custom_serializer)
    df = pd.read_json(user_responses_json)
    print(df)
    print(df.shape)
    df.to_json('video_df_25oct.json')
