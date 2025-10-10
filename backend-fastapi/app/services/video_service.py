"""
Video service for business logic.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from uuid import UUID

from app.models.video import Video
from app.schemas.video import VideoCreate, VideoUpdate


class VideoService:
    """Video service class."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, video_data: VideoCreate) -> Video:
        """Create a new video."""
        video = Video(**video_data.dict())
        self.db.add(video)
        await self.db.commit()
        await self.db.refresh(video)
        return video
    
    async def get_by_id(self, video_id: UUID) -> Optional[Video]:
        """Get video by ID with annotations."""
        result = await self.db.execute(
            select(Video)
            .options(selectinload(Video.annotations))
            .where(Video.id == video_id)
        )
        return result.scalar_one_or_none()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Video]:
        """Get all videos with annotations."""
        result = await self.db.execute(
            select(Video)
            .options(selectinload(Video.annotations))
            .offset(skip)
            .limit(limit)
            .order_by(Video.createdAt.desc())
        )
        return result.scalars().all()
    
    async def update(self, video_id: UUID, video_data: VideoUpdate) -> Optional[Video]:
        """Update a video."""
        result = await self.db.execute(
            select(Video).where(Video.id == video_id)
        )
        video = result.scalar_one_or_none()
        
        if not video:
            return None
        
        update_data = video_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(video, field, value)
        
        await self.db.commit()
        await self.db.refresh(video)
        return video
    
    async def delete(self, video_id: UUID) -> bool:
        """Delete a video."""
        result = await self.db.execute(
            select(Video).where(Video.id == video_id)
        )
        video = result.scalar_one_or_none()
        
        if not video:
            return False
        
        await self.db.delete(video)
        await self.db.commit()
        return True
    
    async def increment_views(self, video_id: UUID) -> Optional[Video]:
        """Increment video views."""
        result = await self.db.execute(
            select(Video).where(Video.id == video_id)
        )
        video = result.scalar_one_or_none()
        
        if not video:
            return None
        
        video.views += 1
        await self.db.commit()
        await self.db.refresh(video)
        return video
    
    async def get_count(self) -> int:
        """Get total video count."""
        result = await self.db.execute(select(func.count(Video.id)))
        return result.scalar()
