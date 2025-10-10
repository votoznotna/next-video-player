"""
Video processing service for handling video files.
"""

import os
import uuid
from pathlib import Path
from typing import Optional
import aiofiles
import ffmpeg
from fastapi import UploadFile

from app.schemas.video import VideoCreate


class VideoProcessingService:
    """Video processing service."""
    
    def __init__(self):
        self.videos_dir = Path("videos")
        self.videos_dir.mkdir(exist_ok=True)
    
    async def process_uploaded_video(
        self, 
        file: UploadFile, 
        title: str, 
        description: Optional[str] = None
    ) -> VideoCreate:
        """Process an uploaded video file."""
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        filename = f"{uuid.uuid4()}{file_extension}"
        file_path = self.videos_dir / filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Get video metadata
        duration = await self.get_video_duration(file_path)
        
        return VideoCreate(
            title=title,
            description=description,
            filename=filename,
            originalName=file.filename,
            mimeType=file.content_type,
            size=len(content),
            duration=duration
        )
    
    async def get_video_duration(self, file_path: Path) -> float:
        """Get video duration using ffmpeg."""
        try:
            probe = ffmpeg.probe(str(file_path))
            duration = float(probe['streams'][0]['duration'])
            return duration
        except Exception as e:
            print(f"Error getting video duration: {e}")
            return 0.0
    
    async def process_video_async(self, video_id: uuid.UUID, file: UploadFile):
        """Process video asynchronously (thumbnails, etc.)."""
        try:
            # Generate thumbnail
            await self.generate_thumbnail(video_id, file)
            print(f"Video processing completed for {video_id}")
        except Exception as e:
            print(f"Error processing video {video_id}: {e}")
    
    async def generate_thumbnail(self, video_id: uuid.UUID, file: UploadFile):
        """Generate video thumbnail."""
        try:
            file_path = self.videos_dir / f"{video_id}.mp4"
            thumbnail_path = self.videos_dir / f"{video_id}_thumb.jpg"
            
            # Generate thumbnail at 10 seconds
            (
                ffmpeg
                .input(str(file_path), ss=10)
                .output(str(thumbnail_path), vframes=1, format='image2', vcodec='mjpeg')
                .overwrite_output()
                .run(quiet=True)
            )
            
            print(f"Thumbnail generated for {video_id}")
        except Exception as e:
            print(f"Error generating thumbnail for {video_id}: {e}")
