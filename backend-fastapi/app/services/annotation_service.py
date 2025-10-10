"""
Annotation service for business logic.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.models.annotation import Annotation
from app.schemas.annotation import AnnotationCreate, AnnotationUpdate


class AnnotationService:
    """Annotation service class."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, annotation_data: AnnotationCreate) -> Annotation:
        """Create a new annotation."""
        annotation = Annotation(**annotation_data.dict())
        self.db.add(annotation)
        await self.db.commit()
        await self.db.refresh(annotation)
        return annotation
    
    async def get_by_id(self, annotation_id: UUID) -> Optional[Annotation]:
        """Get annotation by ID."""
        result = await self.db.execute(
            select(Annotation).where(Annotation.id == annotation_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_video_id(self, video_id: UUID) -> List[Annotation]:
        """Get all annotations for a video."""
        result = await self.db.execute(
            select(Annotation)
            .where(Annotation.video_id == video_id)
            .order_by(Annotation.start_time)
        )
        return result.scalars().all()
    
    async def update(self, annotation_id: UUID, annotation_data: AnnotationUpdate) -> Optional[Annotation]:
        """Update an annotation."""
        result = await self.db.execute(
            select(Annotation).where(Annotation.id == annotation_id)
        )
        annotation = result.scalar_one_or_none()
        
        if not annotation:
            return None
        
        update_data = annotation_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(annotation, field, value)
        
        await self.db.commit()
        await self.db.refresh(annotation)
        return annotation
    
    async def delete(self, annotation_id: UUID) -> bool:
        """Delete an annotation."""
        result = await self.db.execute(
            select(Annotation).where(Annotation.id == annotation_id)
        )
        annotation = result.scalar_one_or_none()
        
        if not annotation:
            return False
        
        await self.db.delete(annotation)
        await self.db.commit()
        return True
