from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class CAPABase(BaseModel):
    action_type: str  # CORRECTIVE ya PREVENTIVE
    description: str
    assigned_to: Optional[str] = None
    status: Optional[str] = "OPEN"
    target_date: Optional[datetime] = None

class CAPACreate(CAPABase):
    complaint_id: int

class CAPAUpdate(BaseModel):
    action_type: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    status: Optional[str] = None
    target_date: Optional[datetime] = None

class CAPAResponse(CAPABase):
    id: int
    complaint_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)