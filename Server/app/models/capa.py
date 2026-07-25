from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class CAPA(Base):
    __tablename__ = "capas"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(String(50), nullable=False)  # CORRECTIVE / PREVENTIVE
    description = Column(Text, nullable=False)
    assigned_to = Column(String(100), nullable=True)
    status = Column(String(50), default="OPEN")       # OPEN, IN_PROGRESS, CLOSED
    target_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    complaint = relationship("Complaint", back_populates="capas")