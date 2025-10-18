"""
Video streaming API endpoints with range request support.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from pathlib import Path
import os

from app.core.database import get_db
from app.models.video import Video
from sqlalchemy import select

router = APIRouter()


@router.get("/videos/{video_id}/stream")
async def stream_video(
    video_id: UUID,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Stream video with range request support for seeking."""
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
    
    file_size = video_path.stat().st_size
    
    # Get range header
    range_header = request.headers.get('Range')
    
    if range_header:
        # Parse range header
        range_match = range_header.replace('bytes=', '').split('-')
        start = int(range_match[0]) if range_match[0] else 0
        end = int(range_match[1]) if range_match[1] else file_size - 1
        
        # Ensure end doesn't exceed file size
        end = min(end, file_size - 1)
        
        # Calculate content length
        content_length = end - start + 1
        
        def iterfile():
            with open(video_path, mode="rb") as file_like:
                file_like.seek(start)
                remaining = content_length
                while remaining:
                    chunk_size = min(8192, remaining)  # 8KB chunks
                    chunk = file_like.read(chunk_size)
                    if not chunk:
                        break
                    remaining -= len(chunk)
                    yield chunk
        
        # Return partial content response
        return StreamingResponse(
            iterfile(),
            status_code=206,  # Partial Content
            headers={
                "Content-Range": f"bytes {start}-{end}/{file_size}",
                "Accept-Ranges": "bytes",
                "Content-Length": str(content_length),
                "Content-Type": "video/webm" if video.filename.endswith('.webm') else "video/mp4",
                "Cache-Control": "public, max-age=3600",
            }
        )
    else:
        # No range header, return full file
        def iterfile():
            with open(video_path, mode="rb") as file_like:
                yield from file_like
        
        return StreamingResponse(
            iterfile(),
            headers={
                "Accept-Ranges": "bytes",
                "Content-Length": str(file_size),
                "Content-Type": "video/webm" if video.filename.endswith('.webm') else "video/mp4",
                "Cache-Control": "public, max-age=3600",
            }
        )
