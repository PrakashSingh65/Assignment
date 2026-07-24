from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# Common Base Schema
class ComplaintBase(BaseModel):
    source: Optional[str] = None
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    strength: Optional[str] = None
    batch_no: Optional[str] = None
    mfg_date: Optional[str] = None
    exp_date: Optional[str] = None
    quantity: Optional[str] = None
    complaint_type: Optional[str] = None
    complaint_date: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    priority: Optional[str] = None

# Request Schema for Creating Complaint
class ComplaintCreate(ComplaintBase):
    pass

# Request Schema for Updating Complaint
class ComplaintUpdate(ComplaintBase):
    status: Optional[str] = None

# Response Schema for API Output
class ComplaintResponse(ComplaintBase):
    id: int
    complaint_number: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)