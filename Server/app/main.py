from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.db.database import Base, engine

load_dotenv()

# Tables auto-create karne ke liye (Alembic na use karne par bhi basic tables ban jayenge)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=os.getenv("PROJECT_NAME", "Complaint Intake System"),
    version="1.0.0",
)

# Frontend (React/Vite) CORS Access Allow karne ke liye
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production me front-end URL dalein, e.g., "http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to Quality Assurance Complaint Management API", "status": "Active"}