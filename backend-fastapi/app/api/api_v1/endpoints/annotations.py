"""
Annotation API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.services.annotation_service import AnnotationService
from app.schemas.annotation import Annotation, AnnotationCreate, AnnotationUpdate

router = APIRouter()


@router.get("/video/{video_id}", response_model=List[Annotation])
async def get_annotations_by_video(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all annotations for a video."""
    annotation_service = AnnotationService(db)
    annotations = await annotation_service.get_by_video_id(video_id)
    return annotations


@router.get("/{annotation_id}", response_model=Annotation)
async def get_annotation(
    annotation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get an annotation by ID."""
    annotation_service = AnnotationService(db)
    annotation = await annotation_service.get_by_id(annotation_id)
    
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")
    
    return annotation


@router.post("/", response_model=Annotation)
async def create_annotation(
    annotation_data: AnnotationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new annotation."""
    annotation_service = AnnotationService(db)
    annotation = await annotation_service.create(annotation_data)
    return annotation


@router.put("/{annotation_id}", response_model=Annotation)
async def update_annotation(
    annotation_id: UUID,
    annotation_data: AnnotationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an annotation."""
    annotation_service = AnnotationService(db)
    annotation = await annotation_service.update(annotation_id, annotation_data)
    
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")
    
    return annotation


@router.delete("/{annotation_id}")
async def delete_annotation(
    annotation_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete an annotation."""
    annotation_service = AnnotationService(db)
    success = await annotation_service.delete(annotation_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Annotation not found")
    
    return {"message": "Annotation deleted successfully"}
