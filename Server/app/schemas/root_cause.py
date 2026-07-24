from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class RootCauseBase(BaseModel):
    category: str
    description: str

class RootCauseCreate(RootCauseBase):
    complaint_id: int

class RootCauseResponse(RootCauseBase):
    id: int
    complaint_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)