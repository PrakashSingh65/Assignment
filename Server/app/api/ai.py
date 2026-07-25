from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.complaint import Complaint
from app.models.ai_analysis import AIAnalysis
from app.schemas.ai_analysis import AIAnalysisResponse
from app.services.ai_service import (
    analyze_complaint_text,
    extract_complaint_from_document,
    chat_with_complaints,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)


# ── Request bodies ──

class TextExtractionRequest(BaseModel):
    text: str

class ChatRequest(BaseModel):
    message: str


# ── 1. Run keyword-based AI analysis on an existing complaint ──

@router.post("/analyze/{complaint_id}", response_model=AIAnalysisResponse, status_code=status.HTTP_201_CREATED)
def run_ai_analysis(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    full_text = f"{complaint.complaint_type}. {complaint.complaint_description}"
    analysis_data = analyze_complaint_text(full_text)

    existing_analysis = db.query(AIAnalysis).filter(AIAnalysis.complaint_id == complaint_id).first()

    if existing_analysis:
        for key, value in analysis_data.items():
            setattr(existing_analysis, key, value)
        db.commit()
        db.refresh(existing_analysis)
        return existing_analysis
    else:
        db_ai = AIAnalysis(
            complaint_id=complaint_id,
            **analysis_data
        )
        db.add(db_ai)
        db.commit()
        db.refresh(db_ai)
        return db_ai


# ── 2. Extract structured fields from raw text (for form auto-fill) ──

@router.post("/extract_text", status_code=status.HTTP_200_OK)
def extract_text_to_complaint(req: TextExtractionRequest):
    extracted = extract_complaint_from_document(req.text)
    return {"extracted_data": extracted}


# ── 3. Chat with AI about complaints stored in the database ──

@router.post("/chat", status_code=status.HTTP_200_OK)
def chat_about_complaints(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Fetches all complaints from the DB, serialises them as context,
    and asks Gemini to answer the user's question via LangGraph.
    """
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).limit(50).all()
    answer = chat_with_complaints(req.message, complaints)
    return {"answer": answer}