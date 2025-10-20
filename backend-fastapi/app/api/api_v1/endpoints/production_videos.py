"""
Production video endpoints for serving 5-minute video chunks.
"""

import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse, Response
from typing import Optional
import mimetypes

router = APIRouter()

@router.get("/production/{filename}")
async def serve_production_video(filename: str, request: Request):
    """
    Serve production video chunks from the production directory with range request support.
    """
    # Security check - only allow .webm files
    if not filename.endswith('.webm'):
        raise HTTPException(status_code=400, detail="Only .webm files are allowed")
    
    # Construct the file path
    video_path = os.path.join("/app/videos/production", filename)
    
    # Check if file exists
    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video file not found")
    
    # Get file size
    file_size = os.path.getsize(video_path)
    
    # Check for range request
    range_header = request.headers.get('range')
    
    if range_header:
        # Parse range header
        range_match = range_header.replace('bytes=', '').split('-')
        start = int(range_match[0]) if range_match[0] else 0
        end = int(range_match[1]) if range_match[1] else file_size - 1
        
        # Ensure end doesn't exceed file size
        end = min(end, file_size - 1)
        
        # Calculate content length
        content_length = end - start + 1
        
        # Read the requested range
        with open(video_path, 'rb') as f:
            f.seek(start)
            data = f.read(content_length)
        
        # Return partial content response
        return Response(
            content=data,
            status_code=206,
            headers={
                'Content-Range': f'bytes {start}-{end}/{file_size}',
                'Accept-Ranges': 'bytes',
                'Content-Length': str(content_length),
                'Content-Type': 'video/webm',
            }
        )
    else:
        # Return full file
        def iterfile():
            with open(video_path, 'rb') as f:
                while True:
                    data = f.read(8192)  # Read in chunks
                    if not data:
                        break
                    yield data
        
        return StreamingResponse(
            iterfile(),
            media_type='video/webm',
            headers={
                'Accept-Ranges': 'bytes',
                'Content-Length': str(file_size),
            }
        )

@router.get("/production/")
async def list_production_videos():
    """
    List all available production video files.
    """
    production_dir = "/app/videos/production"
    
    if not os.path.exists(production_dir):
        return {"files": []}
    
    files = []
    for filename in os.listdir(production_dir):
        if filename.endswith('.webm'):
            file_path = os.path.join(production_dir, filename)
            file_size = os.path.getsize(file_path)
            files.append({
                "filename": filename,
                "size": file_size,
                "path": f"/api/v1/videos/production/{filename}"
            })
    
    return {"files": files}
