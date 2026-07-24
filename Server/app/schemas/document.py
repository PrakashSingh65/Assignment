from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    file_size: int

class DocumentCreate(DocumentBase):
    file_path: str
    raw_text: Optional[str] = None
    complaint_id: Optional[int] = None

class DocumentResponse(DocumentBase):
    id: int
    complaint_id: Optional[int] = None
    file_path: str
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)