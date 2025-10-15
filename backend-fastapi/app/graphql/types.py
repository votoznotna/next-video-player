"""
GraphQL Types
"""
import strawberry
from typing import Optional, List
from uuid import UUID
from datetime import datetime


@strawberry.type
class Video:
    id: strawberry.ID
    title: str
    description: Optional[str]
    filename: str
    original_name: str = strawberry.field(name="originalName")
    mime_type: str = strawberry.field(name="mimeType")
    size: int
    duration: float
    views: int
    is_active: bool = strawberry.field(name="isActive")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")
    annotations: List["Annotation"] = strawberry.field(default_factory=list)
    
    @strawberry.field
    def file_url(self) -> str:
        return f"/videos/{self.filename}"


@strawberry.type
class Annotation:
    id: strawberry.ID
    title: str
    description: Optional[str]
    start_time: float = strawberry.field(name="startTime")
    end_time: float = strawberry.field(name="endTime")
    type: Optional[str]
    color: Optional[str]
    is_active: bool = strawberry.field(name="isActive")
    video_id: strawberry.ID = strawberry.field(name="videoId")
    created_at: datetime = strawberry.field(name="createdAt")
    updated_at: datetime = strawberry.field(name="updatedAt")


@strawberry.input
class CreateAnnotationInput:
    title: str
    video_id: str = strawberry.field(name="videoId")
    start_time: float = strawberry.field(name="startTime")
    end_time: float = strawberry.field(name="endTime")
    description: Optional[str] = None
    type: Optional[str] = "chapter"
    color: Optional[str] = "#3b82f6"
