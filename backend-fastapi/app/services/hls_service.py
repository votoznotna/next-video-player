"""
HLS (HTTP Live Streaming) service for video streaming.
"""

import os
import uuid
import asyncio
from pathlib import Path
from typing import Optional, List, Dict, Any
import aiofiles
import ffmpeg
import m3u8
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.schemas.video_chunk import VideoChunkCreate
from app.models.video_chunk import VideoChunk


class HLSService:
    """HLS streaming service with adaptive bitrate support."""
    
    def __init__(self, chunk_duration: int = 10):  # 10 seconds for HLS segments
        self.videos_dir = Path("videos")
        self.hls_dir = Path("videos/hls")
        self.thumbnails_dir = Path("videos/thumbnails")
        self.chunk_duration = chunk_duration  # HLS segment duration in seconds
        
        # Create directories
        self.videos_dir.mkdir(exist_ok=True)
        self.hls_dir.mkdir(exist_ok=True)
        self.thumbnails_dir.mkdir(exist_ok=True)
        
        # Quality levels for adaptive bitrate streaming
        self.quality_levels = [
            {"height": 360, "bitrate": 500000, "name": "360p"},
            {"height": 720, "bitrate": 1500000, "name": "720p"},
            {"height": 1080, "bitrate": 3000000, "name": "1080p"},
        ]

    async def create_hls_stream(self, video_id: uuid.UUID, video_path: Path) -> Dict[str, Any]:
        """Create HLS stream with multiple quality levels."""
        try:
            video_hls_dir = self.hls_dir / str(video_id)
            video_hls_dir.mkdir(exist_ok=True)
            
            # Get video metadata
            probe = ffmpeg.probe(str(video_path))
            video_stream = next(s for s in probe['streams'] if s['codec_type'] == 'video')
            original_height = int(video_stream['height'])
            duration = float(probe['format']['duration'])
            
            # Create master playlist
            master_playlist = m3u8.M3U8()
            master_playlist.version = 3
            master_playlist.target_duration = self.chunk_duration
            
            # Generate different quality levels
            for quality in self.quality_levels:
                if quality["height"] <= original_height:
                    await self._create_quality_variant(
                        video_id, video_path, quality, video_hls_dir, master_playlist
                    )
            
            # Save master playlist
            master_playlist_path = video_hls_dir / "playlist.m3u8"
            with open(master_playlist_path, 'w') as f:
                f.write(master_playlist.dumps())
            
            # Generate thumbnail sprites for timeline preview
            await self._generate_thumbnail_sprites(video_id, video_path, video_hls_dir)
            
            return {
                "master_playlist": str(master_playlist_path),
                "qualities": [q["name"] for q in self.quality_levels if q["height"] <= original_height],
                "duration": duration,
                "segment_duration": self.chunk_duration
            }
            
        except Exception as e:
            print(f"Error creating HLS stream for {video_id}: {e}")
            raise HTTPException(status_code=500, detail=f"HLS creation failed: {str(e)}")

    async def _create_quality_variant(
        self, 
        video_id: uuid.UUID, 
        video_path: Path, 
        quality: Dict[str, Any], 
        output_dir: Path,
        master_playlist: m3u8.M3U8
    ):
        """Create a quality variant for HLS streaming."""
        try:
            quality_dir = output_dir / quality["name"]
            quality_dir.mkdir(exist_ok=True)
            
            # Create variant playlist
            variant_playlist = m3u8.M3U8()
            variant_playlist.version = 3
            variant_playlist.target_duration = self.chunk_duration
            variant_playlist.media_sequence = 0
            
            # Generate segments
            segment_pattern = quality_dir / "segment_%03d.ts"
            
            (
                ffmpeg
                .input(str(video_path))
                .output(
                    str(segment_pattern),
                    vcodec='libx264',
                    acodec='aac',
                    preset='fast',
                    crf=23,
                    vf=f'scale=-2:{quality["height"]}',
                    b=f'{quality["bitrate"]}',
                    segment_time=self.chunk_duration,
                    segment_list_flags='+live',
                    segment_list_type='m3u8',
                    segment_list=str(quality_dir / "playlist.m3u8"),
                    f='segment'
                )
                .overwrite_output()
                .run(quiet=True)
            )
            
            # Add variant to master playlist
            variant_uri = f"{quality['name']}/playlist.m3u8"
            variant = m3u8.Variant(
                uri=variant_uri,
                bandwidth=quality["bitrate"],
                resolution=f"{quality['height']}x{int(quality['height'] * 16/9)}"
            )
            master_playlist.add_variant(variant)
            
        except Exception as e:
            print(f"Error creating quality variant {quality['name']}: {e}")
            raise

    async def _generate_thumbnail_sprites(
        self, 
        video_id: uuid.UUID, 
        video_path: Path, 
        output_dir: Path
    ):
        """Generate thumbnail sprites for timeline preview."""
        try:
            # Get video duration
            probe = ffmpeg.probe(str(video_path))
            duration = float(probe['format']['duration'])
            
            # Generate thumbnails every 10 seconds
            thumbnail_interval = 10
            num_thumbnails = int(duration // thumbnail_interval) + 1
            
            thumbnails_dir = output_dir / "thumbnails"
            thumbnails_dir.mkdir(exist_ok=True)
            
            # Generate individual thumbnails
            for i in range(num_thumbnails):
                timestamp = i * thumbnail_interval
                if timestamp >= duration:
                    timestamp = duration - 1
                
                thumbnail_path = thumbnails_dir / f"{i}.jpg"
                
                (
                    ffmpeg
                    .input(str(video_path), ss=timestamp)
                    .output(
                        str(thumbnail_path),
                        vframes=1,
                        format='image2',
                        vcodec='mjpeg',
                        vf='scale=160:90'
                    )
                    .overwrite_output()
                    .run(quiet=True)
                )
            
            # Create sprite sheet (optional - for more efficient loading)
            await self._create_sprite_sheet(thumbnails_dir, output_dir)
            
        except Exception as e:
            print(f"Error generating thumbnail sprites: {e}")

    async def _create_sprite_sheet(self, thumbnails_dir: Path, output_dir: Path):
        """Create a sprite sheet from individual thumbnails."""
        try:
            # This would create a sprite sheet using ImageMagick or similar
            # For now, we'll keep individual thumbnails
            pass
        except Exception as e:
            print(f"Error creating sprite sheet: {e}")

    async def get_hls_playlist(self, video_id: uuid.UUID) -> str:
        """Get HLS master playlist content."""
        try:
            video_hls_dir = self.hls_dir / str(video_id)
            playlist_path = video_hls_dir / "playlist.m3u8"
            
            if not playlist_path.exists():
                raise HTTPException(status_code=404, detail="HLS playlist not found")
            
            async with aiofiles.open(playlist_path, 'r') as f:
                content = await f.read()
            
            return content
            
        except Exception as e:
            print(f"Error getting HLS playlist: {e}")
            raise HTTPException(status_code=500, detail="Failed to get playlist")

    async def get_hls_segment(self, video_id: uuid.UUID, quality: str, segment: str) -> bytes:
        """Get HLS segment content."""
        try:
            segment_path = self.hls_dir / str(video_id) / quality / segment
            
            if not segment_path.exists():
                raise HTTPException(status_code=404, detail="Segment not found")
            
            async with aiofiles.open(segment_path, 'rb') as f:
                content = await f.read()
            
            return content
            
        except Exception as e:
            print(f"Error getting HLS segment: {e}")
            raise HTTPException(status_code=500, detail="Failed to get segment")

    async def get_thumbnail(self, video_id: uuid.UUID, timestamp: int) -> bytes:
        """Get thumbnail for specific timestamp."""
        try:
            thumbnails_dir = self.hls_dir / str(video_id) / "thumbnails"
            thumbnail_path = thumbnails_dir / f"{timestamp}.jpg"
            
            if not thumbnail_path.exists():
                raise HTTPException(status_code=404, detail="Thumbnail not found")
            
            async with aiofiles.open(thumbnail_path, 'rb') as f:
                content = await f.read()
            
            return content
            
        except Exception as e:
            print(f"Error getting thumbnail: {e}")
            raise HTTPException(status_code=500, detail="Failed to get thumbnail")

    async def cleanup_hls_stream(self, video_id: uuid.UUID):
        """Clean up HLS files for a video."""
        try:
            video_hls_dir = self.hls_dir / str(video_id)
            if video_hls_dir.exists():
                import shutil
                shutil.rmtree(video_hls_dir)
        except Exception as e:
            print(f"Error cleaning up HLS stream: {e}")
