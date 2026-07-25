from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.database import Base

class DuplicateCheck(Base):
    __tablename__ = "duplicate_checks"

    id = Column(Integer, primary_key=True, index=True)
    original_complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    matched_complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    similarity_score = Column(Float, nullable=False)  # e.g., 0.85 (85% match)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships (Explicit foreign_keys ke sath)
    original_complaint = relationship("Complaint", foreign_keys=[original_complaint_id])
    matched_complaint = relationship("Complaint", foreign_keys=[matched_complaint_id])