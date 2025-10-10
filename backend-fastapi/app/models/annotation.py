"""
Annotation database model.
"""

from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class Annotation(Base):
    """Annotation model."""
    
    __tablename__ = "annotations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    startTime = Column(Float, nullable=False)
    endTime = Column(Float, nullable=False)
    type = Column(String(50), default="chapter")
    color = Column(String(7), default="#3B82F6")  # Hex color
    isActive = Column(Boolean, default=True)
    videoId = Column(UUID(as_uuid=True), ForeignKey("videos.id"), nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    video = relationship("Video", back_populates="annotations")
    
    def __repr__(self):
        return f"<Annotation(id={self.id}, title='{self.title}', video_id={self.video_id})>"
