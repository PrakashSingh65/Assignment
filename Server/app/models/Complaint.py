from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from sqlalchemy import (
    String,
    Text,
    Date,
    DateTime,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.database import Base


class SeverityEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class PriorityEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class ComplaintStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    INVESTIGATION = "INVESTIGATION"
    CAPA_PENDING = "CAPA_PENDING"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    complaint_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    customer_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    complaint_source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    product_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    product_strength: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    batch_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    manufacturing_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )

    expiry_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )

    quantity_affected: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )

    complaint_type: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    complaint_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    complaint_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        String(50),
        default=SeverityEnum.LOW.value,
        nullable=False,
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        default=PriorityEnum.LOW.value,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default=ComplaintStatusEnum.DRAFT.value,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships with other models
    ai_analysis = relationship("AIAnalysis", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    capas = relationship("CAPA", back_populates="complaint", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="complaint", cascade="all, delete-orphan")
    root_causes = relationship("RootCause", back_populates="complaint", cascade="all, delete-orphan")
    history_logs = relationship("HistoryLog", back_populates="complaint", cascade="all, delete-orphan")