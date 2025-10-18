"""
Video chunk API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.services.video_processing import VideoProcessingService
from app.schemas.video_chunk import VideoChunk, VideoChunkWithVideo
from app.models.video_chunk import VideoChunk as VideoChunkModel
from sqlalchemy import select

router = APIRouter()


@router.get("/videos/{video_id}/chunks", response_model=List[VideoChunk])
async def get_video_chunks(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get all chunks for a video."""
    video_service = VideoProcessingService()
    chunks = await video_service.get_video_chunks(video_id, db)
    return chunks


@router.get("/videos/{video_id}/chunks/{chunk_id}", response_model=VideoChunk)
async def get_video_chunk(
    video_id: UUID,
    chunk_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific video chunk."""
    result = await db.execute(
        select(VideoChunkModel)
        .where(VideoChunkModel.id == chunk_id, VideoChunkModel.video_id == video_id)
    )
    chunk = result.scalar_one_or_none()
    
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    
    return chunk


@router.get("/videos/{video_id}/chunks/{chunk_id}/stream")
async def stream_video_chunk(
    video_id: UUID,
    chunk_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Stream a video chunk."""
    result = await db.execute(
        select(VideoChunkModel)
        .where(VideoChunkModel.id == chunk_id, VideoChunkModel.video_id == video_id)
    )
    chunk = result.scalar_one_or_none()
    
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    
    video_service = VideoProcessingService()
    chunk_path = video_service.chunks_dir / chunk.filename
    
    if not chunk_path.exists():
        raise HTTPException(status_code=404, detail="Chunk file not found")
    
    def iterfile():
        with open(chunk_path, mode="rb") as file_like:
            yield from file_like
    
    return Response(
        iterfile(),
        media_type="video/mp4",
        headers={
            "Content-Disposition": f"inline; filename={chunk.filename}",
            "Accept-Ranges": "bytes",
        }
    )


@router.get("/videos/{video_id}/frame/{time_seconds}")
async def get_frame_preview(
    video_id: UUID,
    time_seconds: float,
    db: AsyncSession = Depends(get_db)
):
    """Get a frame preview for the specified time."""
    video_service = VideoProcessingService()
    frame_data = await video_service.generate_frame_preview(video_id, time_seconds, db)
    
    if not frame_data:
        raise HTTPException(status_code=404, detail="Frame not found")
    
    return Response(
        content=frame_data,
        media_type="image/jpeg",
        headers={
            "Cache-Control": "public, max-age=3600",
        }
    )


@router.get("/videos/{video_id}/timeline-thumbnails")
async def get_timeline_thumbnails(
    video_id: UUID,
    num_thumbnails: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """Get timeline thumbnails for a video."""
    video_service = VideoProcessingService()
    thumbnails = await video_service.generate_timeline_thumbnails(video_id, db, num_thumbnails)
    
    if not thumbnails:
        raise HTTPException(status_code=404, detail="No thumbnails found")
    
    # Return the first thumbnail as an example
    # In a real implementation, you might want to return all thumbnails or create a sprite sheet
    return Response(
        content=thumbnails[0] if thumbnails else b"",
        media_type="image/jpeg",
        headers={
            "Cache-Control": "public, max-age=3600",
        }
    )
