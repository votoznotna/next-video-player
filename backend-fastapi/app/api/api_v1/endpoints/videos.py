"""
Video API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.services.video_service import VideoService
from app.schemas.video import Video, VideoCreate, VideoUpdate, VideoList
from app.services.video_processing import VideoProcessingService

router = APIRouter()


@router.get("/", response_model=VideoList)
async def get_videos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """Get all videos."""
    video_service = VideoService(db)
    videos = await video_service.get_all(skip=skip, limit=limit)
    total = await video_service.get_count()
    
    return VideoList(
        videos=videos,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{video_id}", response_model=Video)
async def get_video(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a video by ID."""
    video_service = VideoService(db)
    video = await video_service.get_by_id(video_id)
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return video


@router.post("/", response_model=Video)
async def create_video(
    video_data: VideoCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new video."""
    video_service = VideoService(db)
    video = await video_service.create(video_data)
    return video


@router.put("/{video_id}", response_model=Video)
async def update_video(
    video_id: UUID,
    video_data: VideoUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a video."""
    video_service = VideoService(db)
    video = await video_service.update(video_id, video_data)
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return video


@router.delete("/{video_id}")
async def delete_video(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a video."""
    video_service = VideoService(db)
    success = await video_service.delete(video_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {"message": "Video deleted successfully"}


@router.post("/{video_id}/view")
async def increment_video_views(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Increment video views."""
    video_service = VideoService(db)
    video = await video_service.increment_views(video_id)
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return {"views": video.views}


@router.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Query(..., description="Video title"),
    description: str = Query(None, description="Video description"),
    db: AsyncSession = Depends(get_db)
):
    """Upload a new video file."""
    # Validate file type
    if file.content_type not in ["video/mp4", "video/avi", "video/mov", "video/webm"]:
        raise HTTPException(status_code=400, detail="Invalid video file type")
    
    # Validate file size (500MB limit)
    if file.size > 500 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 500MB)")
    
    # Process video in background
    video_processing = VideoProcessingService()
    video_data = await video_processing.process_uploaded_video(
        file, title, description
    )
    
    # Create video record
    video_service = VideoService(db)
    video = await video_service.create(video_data)
    
    # Add background task for video processing
    background_tasks.add_task(
        video_processing.process_video_async,
        video.id,
        file
    )
    
    return {"message": "Video uploaded successfully", "video_id": video.id}
