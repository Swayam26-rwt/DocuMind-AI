import uuid
from sqlalchemy import String, ForeignKey, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class ExtractionResult(Base):
    __tablename__ = "extraction_results"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    version_id: Mapped[str] = mapped_column(ForeignKey("document_versions.id"))
    extraction_type: Mapped[str] = mapped_column(String(100))
    extracted_data: Mapped[dict] = mapped_column(JSON, default=dict)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(30), default="PENDING")
