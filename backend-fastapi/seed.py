"""
Database seeding script for FastAPI backend.
"""

import asyncio
import os
from pathlib import Path
import aiofiles
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.models import Video, Annotation
from app.services.video_service import VideoService
from app.services.annotation_service import AnnotationService
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
        
        # Sample videos data
        sample_videos = [
            {
                "title": "Introduction to React Hooks",
                "description": "Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks.",
                "filename": "react-hooks-intro.mp4",
                "originalName": "react-hooks-intro.mp4",
                "mimeType": "video/mp4",
                "size": 15728640,
                "duration": 1200,
            },
            {
                "title": "Advanced TypeScript Patterns",
                "description": "Explore advanced TypeScript patterns and best practices for large-scale applications.",
                "filename": "typescript-advanced.mp4",
                "originalName": "typescript-advanced.mp4",
                "mimeType": "video/mp4",
                "size": 25165824,
                "duration": 1800,
            },
            {
                "title": "GraphQL with NestJS",
                "description": "Build scalable APIs with GraphQL and NestJS framework.",
                "filename": "graphql-nestjs.mp4",
                "originalName": "graphql-nestjs.mp4",
                "mimeType": "video/mp4",
                "size": 31457280,
                "duration": 2400,
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
        
        # Sample annotations for the first video
        sample_annotations = [
            {
                "title": "Introduction",
                "description": "Welcome and overview of the course",
                "startTime": 0,
                "endTime": 60,
                "type": "chapter",
                "color": "#3B82F6",
                "videoId": created_videos[0].id,
            },
            {
                "title": "useState Hook",
                "description": "Understanding the useState hook for state management",
                "startTime": 60,
                "endTime": 300,
                "type": "chapter",
                "color": "#10B981",
                "videoId": created_videos[0].id,
            },
            {
                "title": "useEffect Hook",
                "description": "Side effects and lifecycle management with useEffect",
                "startTime": 300,
                "endTime": 600,
                "type": "chapter",
                "color": "#F59E0B",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Custom Hooks",
                "description": "Creating reusable custom hooks",
                "startTime": 600,
                "endTime": 900,
                "type": "chapter",
                "color": "#EF4444",
                "videoId": created_videos[0].id,
            },
            {
                "title": "Best Practices",
                "description": "React Hooks best practices and common pitfalls",
                "startTime": 900,
                "endTime": 1200,
                "type": "chapter",
                "color": "#8B5CF6",
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
        
        print("🎉 FastAPI seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
