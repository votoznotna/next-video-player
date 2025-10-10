"""
Video Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

from app.schemas.annotation import Annotation


class VideoBase(BaseModel):
    """Base video schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    filename: str = Field(..., min_length=1, max_length=255)
    originalName: str = Field(..., min_length=1, max_length=255)
    mimeType: str = Field(..., min_length=1, max_length=100)
    size: int = Field(..., gt=0)
    duration: float = Field(..., gt=0)
    views: int = Field(default=0, ge=0)
    isActive: bool = Field(default=True)


class VideoCreate(VideoBase):
    """Schema for creating a video."""
    pass


class VideoUpdate(BaseModel):
    """Schema for updating a video."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    views: Optional[int] = Field(None, ge=0)
    isActive: Optional[bool] = None


class Video(VideoBase):
    """Schema for video response."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    annotations: List[Annotation] = []
    
    class Config:
        from_attributes = True


class VideoList(BaseModel):
    """Schema for video list response."""
    videos: List[Video]
    total: int
    page: int
    size: int
