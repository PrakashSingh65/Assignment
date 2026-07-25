from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime

# Common Base Schema
class ComplaintBase(BaseModel):
    complaint_source: str
    customer_name: str
    product_name: str
    product_strength: Optional[str] = None
    batch_number: str
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    quantity_affected: Optional[int] = None
    complaint_type: str
    complaint_description: str
    complaint_date: date
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