# FastAPI Deepfake Detection Project


## Features Implemented

1. **User Signup**: Allows users to register using an IITK email address (`@iitk.ac.in` or `@cse.iitk.ac.in`).
2. **JWT Authentication**: Token-based authentication using JSON Web Tokens for secure user sessions.
3. **Database Integration**: PostgreSQL database for storing user, video, and response data.

---

## Prerequisites

Before setting up and running the application, ensure that you have the following installed:

- **Python 3.10+**
- **PostgreSQL**
- **Virtualenv (optional but recommended)**

## Local Setup Instructions

Follow these steps to set up the application locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate   # For Linux/Mac
# .venv\Scripts\activate.bat # For Windows

# Install required packages
pip install -r requirements.txt
```

### 3. Configure PostgreSQL Database

1. Install PostgreSQL on your system and create a new database:
    ```bash
    sudo -u postgres psql
    CREATE DATABASE deepfake_detection;
    CREATE USER your_username WITH PASSWORD 'your_password';
    ALTER ROLE your_username SET client_encoding TO 'utf8';
    ALTER ROLE your_username SET default_transaction_isolation TO 'read committed';
    ALTER ROLE your_username SET timezone TO 'UTC';
    GRANT ALL PRIVILEGES ON DATABASE deepfake_detection TO your_username;
    ```

2. Update the database URL in the environment configuration file (`.env` or `database.py`):
    ```bash
    DATABASE_URL=postgresql://your_username:your_password@localhost/deepfake_detection
    ```


### 4. Run the Application

To start the FastAPI application, run:

```bash
uvicorn main:app --reload
```

The application will be available at `http://127.0.0.1:8000`.

---

## API Endpoints

### 1. **Signup**

**Endpoint**: `POST /auth/signup`  
Registers a new user. Email validation ensures the email domain is either `@iitk.ac.in` or `@cse.iitk.ac.in`.

**Payload**:
```json
{
    "email": "your_email@iitk.ac.in",
    "password": "your_password",
    "age": 25,
    "department": "CSE",
    "branch": "M.Tech"
}
```

**Response**:
```json
{
    "access_token": "<JWT_TOKEN>",
    "token_type": "bearer"
}
```

### 2. **Login**

**Endpoint**: `POST /auth/login`  
Generates a JWT token upon successful login.

**Payload**:
```json
{
    "email": "your_email@iitk.ac.in",
    "password": "your_password"
}
```

**Response**:
```json
{
    "access_token": "<JWT_TOKEN>",
    "token_type": "bearer"
}
```