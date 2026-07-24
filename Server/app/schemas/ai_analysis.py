from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class AIAnalysisBase(BaseModel):
    summary: Optional[str] = None
    extracted_entities: Optional[Dict[str, Any]] = None
    confidence_score: Optional[str] = None

class AIAnalysisCreate(AIAnalysisBase):
    complaint_id: int

class AIAnalysisResponse(AIAnalysisBase):
    id: int
    complaint_id: int
    analyzed_at: datetime

    model_config = ConfigDict(from_attributes=True)