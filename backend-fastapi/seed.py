"""
Database seeding script for FastAPI backend.
"""

import asyncio
import os
from pathlib import Path
import aiofiles
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.models import Video, Annotation, VideoChunk
from app.services.video_service import VideoService
from app.services.annotation_service import AnnotationService
from app.services.video_processing import VideoProcessingService
from app.schemas.video import VideoCreate
from app.schemas.annotation import AnnotationCreate


async def seed_database():
    """Seed the database with sample data."""
    print("🌱 Starting FastAPI database seeding...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create videos directory
    videos_dir = Path("videos")
    videos_dir.mkdir(exist_ok=True)
    
    async with AsyncSessionLocal() as db:
        video_service = VideoService(db)
        annotation_service = AnnotationService(db)
        
        # Sample videos data - Only demo video for YouTube-like player
        sample_videos = [
            {
                "title": "Demo Video - YouTube-like Player",
                "description": "A demonstration video showcasing the YouTube-like video player with frame preview and chunking capabilities. This 30-minute video demonstrates how large video files are automatically chunked for efficient streaming.",
                "filename": "demo_video.mp4",
                "originalName": "demo_video.mp4",
                "mimeType": "video/mp4",
                "size": 52428800,  # 50MB
                "duration": 1800,  # 30 minutes for chunking demo
            },
        ]
        
        # Check if videos already exist
        existing_videos = await video_service.get_all()
        if existing_videos:
            print("⚠️ Videos already exist in database. Skipping seeding to prevent duplicates.")
            return
        
        # Create videos
        print("🌱 Seeding videos...")
        created_videos = []
        
        for video_data in sample_videos:
            video_create = VideoCreate(**video_data)
            video = await video_service.create(video_create)
            created_videos.append(video)
            print(f"✅ Created video: {video.title}")
        
        # Sample annotations for the 30-minute demo video
        sample_annotations = [
            {
                "title": "Video Player Introduction",
                "description": "Introduction to the YouTube-like video player features",
                "startTime": 0,
                "endTime": 180,  # 3 minutes
                "type": "chapter",
                "color": "#3B82F6",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Frame Preview Demo",
                "description": "Demonstration of frame preview on timeline hover",
                "startTime": 180,
                "endTime": 360,  # 3-6 minutes
                "type": "chapter",
                "color": "#10B981",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Video Chunking System",
                "description": "How video chunking works for large files",
                "startTime": 360,
                "endTime": 720,  # 6-12 minutes
                "type": "chapter",
                "color": "#F59E0B",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Keyboard Shortcuts",
                "description": "Advanced keyboard controls for video navigation",
                "startTime": 720,
                "endTime": 1080,  # 12-18 minutes
                "type": "chapter",
                "color": "#EF4444",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Annotation System",
                "description": "Adding and managing video annotations",
                "startTime": 1080,
                "endTime": 1440,  # 18-24 minutes
                "type": "chapter",
                "color": "#8B5CF6",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Performance Features",
                "description": "Optimizations for large video files",
                "startTime": 1440,
                "endTime": 1800,  # 24-30 minutes
                "type": "chapter",
                "color": "#06B6D4",
                "videoId": created_videos[0].id,
            },
        ]
        
        # Create annotations
        print("🌱 Seeding annotations...")
        for annotation_data in sample_annotations:
            annotation_create = AnnotationCreate(**annotation_data)
            annotation = await annotation_service.create(annotation_create)
            print(f"✅ Created annotation: {annotation.title}")
        
        # Create sample video files
        print("📁 Creating sample video files...")
        sample_video_url = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
        
        for video in created_videos:
            video_path = videos_dir / video.filename
            if not video_path.exists():
                try:
                    import aiohttp
                    async with aiohttp.ClientSession() as session:
                        async with session.get(sample_video_url) as response:
                            if response.status == 200:
                                content = await response.read()
                                async with aiofiles.open(video_path, 'wb') as f:
                                    await f.write(content)
                                print(f"📹 Created sample video file: {video.filename}")
                            else:
                                print(f"⚠️ Could not download sample video for {video.filename}")
                except Exception as e:
                    print(f"⚠️ Error creating video file {video.filename}: {e}")
            else:
                print(f"📹 Video file already exists: {video.filename}")
        
        # Process video chunks for the demo video
        print("🔧 Processing video chunks...")
        video_processing_service = VideoProcessingService(chunk_duration=120)  # 2 minutes
        
        for video in created_videos:
            video_path = videos_dir / video.filename
            if video_path.exists() and video.title == "Demo Video - YouTube-like Player":
                try:
                    chunks = await video_processing_service.chunk_video(video.id, video_path, db)
                    print(f"✅ Created {len(chunks)} chunks for {video.title}")
                except Exception as e:
                    print(f"⚠️ Error chunking video {video.title}: {e}")
        
        print("🎉 FastAPI seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
