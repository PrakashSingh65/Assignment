from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class HistoryLog(Base):
    __tablename__ = "history_logs"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    action_by = Column(String(100), nullable=False)
    action_taken = Column(String(100), nullable=False)  # e.g., STATUS_CHANGE, CAPA_ADDED
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    complaint = relationship("Complaint", back_populates="history_logs")