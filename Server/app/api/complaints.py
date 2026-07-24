from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import random
import string

from app.db.database import get_db
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintResponse

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)

# Helper function to generate unique complaint numbers (e.g. CMP-84920)
def generate_complaint_number() -> str:
    random_digits = ''.join(random.choices(string.digits, k=5))
    return f"CMP-{random_digits}"

# 1. Create a new Complaint
@router.post("/", response_model=ComplaintResponse, status_code=status.HTTP_211_CREATED)
def create_complaint(complaint_in: ComplaintCreate, db: Session = Depends(get_db)):
    db_complaint = Complaint(
        **complaint_in.model_dump(),
        complaint_number=generate_complaint_number()
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

# 2. Get All Complaints
@router.get("/", response_model=List[ComplaintResponse])
def get_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Complaint).offset(skip).limit(limit).all()

# 3. Get Single Complaint by ID
@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

# 4. Update a Complaint
@router.put("/{complaint_id}", response_model=ComplaintResponse)
def update_complaint(complaint_id: int, complaint_in: ComplaintUpdate, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    update_data = complaint_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(complaint, key, value)
        
    db.commit()
    db.refresh(complaint)
    return complaint

# 5. Delete a Complaint
@router.delete("/{complaint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    db.delete(complaint)
    db.commit()
    return None