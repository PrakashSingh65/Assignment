from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class HistoryLogBase(BaseModel):
    action_by: str
    action_taken: str
    details: Optional[str] = None

class HistoryLogCreate(HistoryLogBase):
    complaint_id: int

class HistoryLogResponse(HistoryLogBase):
    id: int
    complaint_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)