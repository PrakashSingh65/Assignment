from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.complaint import Complaint
from app.models.ai_analysis import AIAnalysis
from app.schemas.ai_analysis import AIAnalysisResponse
from app.services.ai_service import analyze_complaint_text

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"]
)

@router.post("/analyze/{complaint_id}", response_model=AIAnalysisResponse, status_code=status.HTTP_201_CREATED)
def run_ai_analysis(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    # Run AI Analysis on description & title
    full_text = f"{complaint.title}. {complaint.description}"
    analysis_data = analyze_complaint_text(full_text)
    
    # Save or Update AI Analysis in DB
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