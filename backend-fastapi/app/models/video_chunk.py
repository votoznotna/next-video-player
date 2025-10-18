"""
Video chunk database model for storing video segments.
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class VideoChunk(Base):
    """Video chunk model for storing video segments."""
    
    __tablename__ = "video_chunks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    video_id = Column(UUID(as_uuid=True), ForeignKey("videos.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)  # Order of chunk in video
    filename = Column(String(255), nullable=False)  # Chunk filename
    start_time = Column(Float, nullable=False)  # Start time in seconds
    end_time = Column(Float, nullable=False)  # End time in seconds
    duration = Column(Float, nullable=False)  # Chunk duration in seconds
    size = Column(Integer, nullable=False)  # File size in bytes
    fps = Column(Float, nullable=True)  # Frames per second
    width = Column(Integer, nullable=True)  # Video width
    height = Column(Integer, nullable=True)  # Video height
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    video = relationship("Video", back_populates="chunks")
    
    def __repr__(self):
        return f"<VideoChunk(id={self.id}, video_id={self.video_id}, chunk_index={self.chunk_index})>"
