"""
Video chunk schemas for API serialization.
"""

from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class VideoChunkBase(BaseModel):
    """Base video chunk schema."""
    chunk_index: int
    filename: str
    start_time: float
    end_time: float
    duration: float
    size: int
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None


class VideoChunkCreate(VideoChunkBase):
    """Schema for creating a video chunk."""
    video_id: UUID


class VideoChunkUpdate(BaseModel):
    """Schema for updating a video chunk."""
    chunk_index: Optional[int] = None
    filename: Optional[str] = None
    start_time: Optional[float] = None
    end_time: Optional[float] = None
    duration: Optional[float] = None
    size: Optional[int] = None
    fps: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    isActive: Optional[bool] = None


class VideoChunk(VideoChunkBase):
    """Schema for video chunk response."""
    id: UUID
    video_id: UUID
    isActive: bool
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class VideoChunkWithVideo(VideoChunk):
    """Schema for video chunk with video information."""
    video: Optional[dict] = None
