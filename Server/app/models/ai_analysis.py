from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, unique=True)
    summary = Column(Text, nullable=True)
    extracted_entities = Column(JSON, nullable=True)  # JSON data (key-values)
    confidence_score = Column(String(50), nullable=True)
    analyzed_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    complaint = relationship("Complaint", back_populates="ai_analysis")