"""
HLS streaming API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from pathlib import Path

from app.core.database import get_db
from app.services.hls_service import HLSService
from app.services.video_processing import VideoProcessingService
from app.models.video import Video
from sqlalchemy import select

router = APIRouter()


@router.get("/videos/{video_id}/hls/playlist.m3u8", response_class=PlainTextResponse)
async def get_hls_playlist(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get HLS master playlist."""
    hls_service = HLSService()
    
    try:
        # Check if HLS stream exists
        video_hls_dir = hls_service.hls_dir / str(video_id)
        if not video_hls_dir.exists():
            # Create HLS stream if it doesn't exist
            result = await db.execute(
                select(Video).where(Video.id == video_id)
            )
            video = result.scalar_one_or_none()
            
            if not video:
                raise HTTPException(status_code=404, detail="Video not found")
            
            video_path = Path("videos") / video.filename
            if not video_path.exists():
                raise HTTPException(status_code=404, detail="Video file not found")
            
            # Create HLS stream
            await hls_service.create_hls_stream(video_id, video_path)
        
        # Get playlist content
        playlist_content = await hls_service.get_hls_playlist(video_id)
        
        return Response(
            content=playlist_content,
            media_type="application/vnd.apple.mpegurl",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Access-Control-Allow-Origin": "*",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get playlist: {str(e)}")


@router.get("/videos/{video_id}/hls/{quality}/playlist.m3u8", response_class=PlainTextResponse)
async def get_quality_playlist(
    video_id: UUID,
    quality: str,
    db: AsyncSession = Depends(get_db)
):
    """Get quality-specific HLS playlist."""
    hls_service = HLSService()
    
    try:
        quality_dir = hls_service.hls_dir / str(video_id) / quality
        playlist_path = quality_dir / "playlist.m3u8"
        
        if not playlist_path.exists():
            raise HTTPException(status_code=404, detail="Quality playlist not found")
        
        async with open(playlist_path, 'r') as f:
            content = f.read()
        
        return Response(
            content=content,
            media_type="application/vnd.apple.mpegurl",
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Access-Control-Allow-Origin": "*",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get quality playlist: {str(e)}")


@router.get("/videos/{video_id}/hls/{quality}/{segment}")
async def get_hls_segment(
    video_id: UUID,
    quality: str,
    segment: str,
    db: AsyncSession = Depends(get_db)
):
    """Get HLS segment."""
    hls_service = HLSService()
    
    try:
        segment_content = await hls_service.get_hls_segment(video_id, quality, segment)
        
        return Response(
            content=segment_content,
            media_type="video/mp2t",
            headers={
                "Cache-Control": "public, max-age=3600",
                "Access-Control-Allow-Origin": "*",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get segment: {str(e)}")


@router.get("/videos/{video_id}/hls/thumbnails/{timestamp}.jpg")
async def get_hls_thumbnail(
    video_id: UUID,
    timestamp: int,
    db: AsyncSession = Depends(get_db)
):
    """Get HLS thumbnail for timeline preview."""
    hls_service = HLSService()
    
    try:
        thumbnail_content = await hls_service.get_thumbnail(video_id, timestamp)
        
        return Response(
            content=thumbnail_content,
            media_type="image/jpeg",
            headers={
                "Cache-Control": "public, max-age=3600",
                "Access-Control-Allow-Origin": "*",
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get thumbnail: {str(e)}")


@router.post("/videos/{video_id}/hls/generate")
async def generate_hls_stream(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Generate HLS stream for a video."""
    hls_service = HLSService()
    
    try:
        # Get video from database
        result = await db.execute(
            select(Video).where(Video.id == video_id)
        )
        video = result.scalar_one_or_none()
        
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        
        video_path = Path("videos") / video.filename
        if not video_path.exists():
            raise HTTPException(status_code=404, detail="Video file not found")
        
        # Create HLS stream
        hls_info = await hls_service.create_hls_stream(video_id, video_path)
        
        return {
            "message": "HLS stream generated successfully",
            "video_id": video_id,
            "qualities": hls_info["qualities"],
            "duration": hls_info["duration"],
            "segment_duration": hls_info["segment_duration"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate HLS stream: {str(e)}")


@router.delete("/videos/{video_id}/hls")
async def cleanup_hls_stream(
    video_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Clean up HLS stream for a video."""
    hls_service = HLSService()
    
    try:
        await hls_service.cleanup_hls_stream(video_id)
        
        return {
            "message": "HLS stream cleaned up successfully",
            "video_id": video_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cleanup HLS stream: {str(e)}")
