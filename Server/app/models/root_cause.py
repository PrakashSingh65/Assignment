from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class RootCause(Base):
    __tablename__ = "root_causes"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False)  # e.g., Packaging, Raw Material, Human Error
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    complaint = relationship("Complaint", back_populates="root_causes")