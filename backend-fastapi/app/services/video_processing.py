"""
Video processing service for handling video files and chunking.
"""

import os
import uuid
import asyncio
from pathlib import Path
from typing import Optional, List, Dict, Any
import aiofiles
import ffmpeg
import cv2
import numpy as np
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.video import VideoCreate
from app.schemas.video_chunk import VideoChunkCreate
from app.models.video_chunk import VideoChunk


class VideoProcessingService:
    """Video processing service with chunking capabilities."""
    
    def __init__(self, chunk_duration: int = 120):  # 2 minutes default
        self.videos_dir = Path("videos")
        self.chunks_dir = Path("videos/chunks")
        self.thumbnails_dir = Path("videos/thumbnails")
        self.chunk_duration = chunk_duration  # Duration in seconds
        
        # Create directories
        self.videos_dir.mkdir(exist_ok=True)
        self.chunks_dir.mkdir(exist_ok=True)
        self.thumbnails_dir.mkdir(exist_ok=True)
    
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
            thumbnail_path = self.thumbnails_dir / f"{video_id}_thumb.jpg"
            
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

    async def chunk_video(self, video_id: uuid.UUID, video_path: Path, db: AsyncSession) -> List[VideoChunk]:
        """Chunk a video into segments and store metadata in database."""
        try:
            # Get video metadata
            probe = ffmpeg.probe(str(video_path))
            video_stream = next(s for s in probe['streams'] if s['codec_type'] == 'video')
            duration = float(probe['format']['duration'])
            fps = eval(video_stream['r_frame_rate'])  # Convert fraction to float
            width = int(video_stream['width'])
            height = int(video_stream['height'])
            
            print(f"🔍 Video probe results:")
            print(f"   Duration: {duration} seconds ({duration/60:.1f} minutes)")
            print(f"   FPS: {fps}")
            print(f"   Resolution: {width}x{height}")
            print(f"   Chunk duration: {self.chunk_duration} seconds")
            
            chunks = []
            chunk_index = 0
            
            # Calculate number of chunks
            num_chunks = int(duration // self.chunk_duration) + (1 if duration % self.chunk_duration > 0 else 0)
            
            for i in range(num_chunks):
                start_time = i * self.chunk_duration
                end_time = min((i + 1) * self.chunk_duration, duration)
                chunk_duration = end_time - start_time
                
                # Generate chunk filename
                chunk_filename = f"{video_id}_chunk_{chunk_index:03d}.mp4"
                chunk_path = self.chunks_dir / chunk_filename
                
                print(f"Processing chunk {i+1}/{num_chunks}: {start_time}s - {end_time}s")
                
                # Create chunk using ffmpeg
                await self._create_video_chunk(video_path, chunk_path, start_time, chunk_duration)
                
                # Verify chunk was created
                if not chunk_path.exists():
                    print(f"❌ Chunk file was not created: {chunk_path}")
                    continue
                    
                # Get chunk file size
                chunk_size = chunk_path.stat().st_size
                print(f"✅ Chunk {i+1} created: {chunk_size} bytes")
                
                # Create database record
                chunk_data = VideoChunkCreate(
                    video_id=video_id,
                    chunk_index=chunk_index,
                    filename=chunk_filename,
                    start_time=start_time,
                    end_time=end_time,
                    duration=chunk_duration,
                    size=chunk_size,
                    fps=fps,
                    width=width,
                    height=height
                )
                
                chunk = VideoChunk(**chunk_data.dict())
                db.add(chunk)
                chunks.append(chunk)
                chunk_index += 1
            
            await db.commit()
            print(f"Video {video_id} chunked into {len(chunks)} segments")
            return chunks
            
        except Exception as e:
            print(f"Error chunking video {video_id}: {e}")
            await db.rollback()
            return []

    async def _create_video_chunk(self, input_path: Path, output_path: Path, start_time: float, duration: float):
        """Create a video chunk using ffmpeg."""
        try:
            print(f"Creating chunk: {start_time}s - {start_time + duration}s (duration: {duration}s)")
            (
                ffmpeg
                .input(str(input_path), ss=start_time, t=duration)
                .output(str(output_path), 
                       vcodec='libx264', 
                       acodec='aac',
                       preset='fast',
                       crf=23,
                       avoid_negative_ts='make_zero')
                .overwrite_output()
                .run(quiet=False, capture_stdout=True, capture_stderr=True)
            )
            print(f"✅ Chunk created successfully: {output_path}")
        except Exception as e:
            print(f"❌ Error creating chunk {output_path}: {e}")
            raise

    async def get_video_chunks(self, video_id: uuid.UUID, db: AsyncSession) -> List[VideoChunk]:
        """Get all chunks for a video."""
        result = await db.execute(
            select(VideoChunk)
            .where(VideoChunk.video_id == video_id)
            .order_by(VideoChunk.chunk_index)
        )
        return result.scalars().all()

    async def get_chunk_for_time(self, video_id: uuid.UUID, time_seconds: float, db: AsyncSession) -> Optional[VideoChunk]:
        """Get the chunk that contains the specified time."""
        result = await db.execute(
            select(VideoChunk)
            .where(
                VideoChunk.video_id == video_id,
                VideoChunk.start_time <= time_seconds,
                VideoChunk.end_time >= time_seconds
            )
            .order_by(VideoChunk.chunk_index)
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def generate_frame_preview(self, video_id: uuid.UUID, time_seconds: float, db: AsyncSession) -> Optional[bytes]:
        """Generate a frame preview for the specified time."""
        try:
            # Get the chunk for this time
            chunk = await self.get_chunk_for_time(video_id, time_seconds, db)
            if not chunk:
                return None
            
            chunk_path = self.chunks_dir / chunk.filename
            if not chunk_path.exists():
                return None
            
            # Calculate relative time within the chunk
            relative_time = time_seconds - chunk.start_time
            
            # Generate frame using ffmpeg
            frame_data = (
                ffmpeg
                .input(str(chunk_path), ss=relative_time)
                .output('pipe:', vframes=1, format='image2', vcodec='mjpeg', pix_fmt='rgb24')
                .run(capture_stdout=True, quiet=True)
            )[0]
            
            return frame_data
            
        except Exception as e:
            print(f"Error generating frame preview for {video_id} at {time_seconds}s: {e}")
            return None

    async def generate_timeline_thumbnails(self, video_id: uuid.UUID, db: AsyncSession, num_thumbnails: int = 20) -> List[bytes]:
        """Generate thumbnails for timeline preview."""
        try:
            # Get video chunks
            chunks = await self.get_video_chunks(video_id, db)
            if not chunks:
                return []
            
            # Get total duration
            total_duration = max(chunk.end_time for chunk in chunks)
            
            thumbnails = []
            for i in range(num_thumbnails):
                time_seconds = (i / (num_thumbnails - 1)) * total_duration
                frame_data = await self.generate_frame_preview(video_id, time_seconds, db)
                if frame_data:
                    thumbnails.append(frame_data)
            
            return thumbnails
            
        except Exception as e:
            print(f"Error generating timeline thumbnails for {video_id}: {e}")
            return []
