from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.services.document_parser import save_and_parse_file

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

# 1. Upload & Parse Document
@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    complaint_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    file_path, raw_text = await save_and_parse_file(file)
    
    db_doc = Document(
        filename=file.filename,
        file_type=file.content_type or "unknown",
        file_size=file.size or 0,
        file_path=file_path,
        raw_text=raw_text,
        complaint_id=complaint_id
    )
    
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
    return db_doc

# 2. Get All Documents
@router.get("/", response_model=List[DocumentResponse])
def get_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Document).offset(skip).limit(limit).all()

# 3. Get Document by ID
@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc