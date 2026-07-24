from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.db.database import Base, engine
from app.api.complaints import router as complaints_router
from app.api.documents import router as documents_router
from app.api.ai import router as ai_router

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

app.include_router(complaints_router)
app.include_router(documents_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Welcome to Quality Assurance Complaint Management API", "status": "Active"}
