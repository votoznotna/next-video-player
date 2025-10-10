"""
Annotation Pydantic schemas.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class AnnotationBase(BaseModel):
    """Base annotation schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    startTime: float = Field(..., ge=0)
    endTime: float = Field(..., gt=0)
    type: str = Field(default="chapter", max_length=50)
    color: str = Field(default="#3B82F6", pattern=r"^#[0-9A-Fa-f]{6}$")
    isActive: bool = Field(default=True)
    videoId: UUID


class AnnotationCreate(AnnotationBase):
    """Schema for creating an annotation."""
    pass


class AnnotationUpdate(BaseModel):
    """Schema for updating an annotation."""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    startTime: Optional[float] = Field(None, ge=0)
    endTime: Optional[float] = Field(None, gt=0)
    type: Optional[str] = Field(None, max_length=50)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")
    isActive: Optional[bool] = None


class Annotation(AnnotationBase):
    """Schema for annotation response."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
