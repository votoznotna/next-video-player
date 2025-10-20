"""
GraphQL Resolvers
"""
import strawberry
from typing import List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.video import Video as VideoModel
from app.models.annotation import Annotation as AnnotationModel
from app.models.video_chunk import VideoChunk as VideoChunkModel
from app.graphql.types import Video, Annotation, VideoChunk, CreateAnnotationInput


async def get_videos() -> List[Video]:
    """Get all videos"""
    async for db in get_db():
        # Get videos
        result = await db.execute(
            select(VideoModel).where(VideoModel.isActive == True)
        )
        videos = result.scalars().all()
        
        # Get all annotations for these videos
        video_ids = [video.id for video in videos]
        ann_result = await db.execute(
            select(AnnotationModel)
            .where(AnnotationModel.videoId.in_(video_ids))
            .where(AnnotationModel.isActive == True)
        )
        all_annotations = ann_result.scalars().all()
        
        # Group annotations by video_id
        annotations_by_video = {}
        for ann in all_annotations:
            if ann.videoId not in annotations_by_video:
                annotations_by_video[ann.videoId] = []
            annotations_by_video[ann.videoId].append(
                Annotation(
                    id=str(ann.id),
                    title=ann.title,
                    description=ann.description,
                    start_time=ann.startTime,
                    end_time=ann.endTime,
                    type=ann.type,
                    color=ann.color,
                    is_active=ann.isActive,
                    video_id=str(ann.videoId),
                    created_at=ann.createdAt,
                    updated_at=ann.updatedAt,
                )
            )
        
        return [
            Video(
                id=str(video.id),
                title=video.title,
                description=video.description,
                filename=video.filename,
                original_name=video.originalName,
                mime_type=video.mimeType,
                size=video.size,
                duration=video.duration,
                views=video.views or 0,
                is_active=video.isActive,
                is_production=video.isProduction or False,
                total_duration=video.totalDuration,
                case_id=video.caseId,
                source_type=video.sourceType,
                created_at=video.createdAt,
                updated_at=video.updatedAt,
                annotations=annotations_by_video.get(video.id, []),
                chunks=[],  # Will be populated separately for production videos
            )
            for video in videos
        ]


async def get_video(id: strawberry.ID) -> Optional[Video]:
    """Get a single video by ID"""
    async for db in get_db():
        result = await db.execute(
            select(VideoModel).where(VideoModel.id == UUID(id))
        )
        video = result.scalar_one_or_none()
        if not video:
            return None
        
        # Get annotations for this video
        ann_result = await db.execute(
            select(AnnotationModel)
            .where(AnnotationModel.videoId == video.id)
            .where(AnnotationModel.isActive == True)
        )
        annotations = ann_result.scalars().all()
        
        # Get chunks for production videos
        chunks = []
        if video.isProduction:
            chunk_result = await db.execute(
                select(VideoChunkModel)
                .where(VideoChunkModel.video_id == video.id)
                .where(VideoChunkModel.isActive == True)
                .order_by(VideoChunkModel.chunk_index)
            )
            chunk_models = chunk_result.scalars().all()
            chunks = [
                VideoChunk(
                    id=str(chunk.id),
                    video_id=str(chunk.video_id),
                    chunk_index=chunk.chunk_index,
                    filename=chunk.filename,
                    start_time=chunk.start_time,
                    end_time=chunk.end_time,
                    duration=chunk.duration,
                    size=chunk.size,
                    fps=chunk.fps,
                    width=chunk.width,
                    height=chunk.height,
                    is_active=chunk.isActive,
                    created_at=chunk.createdAt,
                    updated_at=chunk.updatedAt,
                )
                for chunk in chunk_models
            ]

        return Video(
            id=str(video.id),
            title=video.title,
            description=video.description,
            filename=video.filename,
            original_name=video.originalName,
            mime_type=video.mimeType,
            size=video.size,
            duration=video.duration,
            views=video.views or 0,
            is_active=video.isActive,
            is_production=video.isProduction or False,
            total_duration=video.totalDuration,
            case_id=video.caseId,
            source_type=video.sourceType,
            created_at=video.createdAt,
            updated_at=video.updatedAt,
            annotations=[
                Annotation(
                    id=str(ann.id),
                    title=ann.title,
                    description=ann.description,
                    start_time=ann.startTime,
                    end_time=ann.endTime,
                    type=ann.type,
                    color=ann.color,
                    is_active=ann.isActive,
                    video_id=str(ann.videoId),
                    created_at=ann.createdAt,
                    updated_at=ann.updatedAt,
                )
                for ann in annotations
            ],
            chunks=chunks,
        )


async def get_annotations_by_video(video_id: strawberry.ID) -> List[Annotation]:
    """Get all annotations for a video"""
    async for db in get_db():
        result = await db.execute(
            select(AnnotationModel)
            .where(AnnotationModel.videoId == UUID(video_id))
            .where(AnnotationModel.isActive == True)
        )
        annotations = result.scalars().all()
        return [
            Annotation(
                id=str(ann.id),
                title=ann.title,
                description=ann.description,
                start_time=ann.startTime,
                end_time=ann.endTime,
                type=ann.type,
                color=ann.color,
                is_active=ann.isActive,
                video_id=str(ann.videoId),
                created_at=ann.createdAt,
                updated_at=ann.updatedAt,
            )
            for ann in annotations
        ]


async def create_annotation(create_annotation_input: CreateAnnotationInput) -> Annotation:
    """Create a new annotation"""
    async for db in get_db():
        annotation = AnnotationModel(
            title=create_annotation_input.title,
            description=create_annotation_input.description,
            startTime=create_annotation_input.start_time,
            endTime=create_annotation_input.end_time,
            type=create_annotation_input.type,
            color=create_annotation_input.color,
            videoId=UUID(create_annotation_input.video_id),
            isActive=True,
        )
        db.add(annotation)
        await db.commit()
        await db.refresh(annotation)
        
        return Annotation(
            id=str(annotation.id),
            title=annotation.title,
            description=annotation.description,
            start_time=annotation.startTime,
            end_time=annotation.endTime,
            type=annotation.type,
            color=annotation.color,
            is_active=annotation.isActive,
            video_id=str(annotation.videoId),
            created_at=annotation.createdAt,
            updated_at=annotation.updatedAt,
        )


async def get_production_videos() -> List[Video]:
    """Get all production videos with chunks"""
    async for db in get_db():
        # Get production videos
        result = await db.execute(
            select(VideoModel)
            .where(VideoModel.isActive == True)
            .where(VideoModel.isProduction == True)
        )
        videos = result.scalars().all()
        
        # Get all annotations for these videos
        video_ids = [video.id for video in videos]
        ann_result = await db.execute(
            select(AnnotationModel)
            .where(AnnotationModel.videoId.in_(video_ids))
            .where(AnnotationModel.isActive == True)
        )
        all_annotations = ann_result.scalars().all()
        
        # Group annotations by video_id
        annotations_by_video = {}
        for ann in all_annotations:
            if ann.videoId not in annotations_by_video:
                annotations_by_video[ann.videoId] = []
            annotations_by_video[ann.videoId].append(
                Annotation(
                    id=str(ann.id),
                    title=ann.title,
                    description=ann.description,
                    start_time=ann.startTime,
                    end_time=ann.endTime,
                    type=ann.type,
                    color=ann.color,
                    is_active=ann.isActive,
                    video_id=str(ann.videoId),
                    created_at=ann.createdAt,
                    updated_at=ann.updatedAt,
                )
            )
        
        # Get chunks for all production videos
        chunk_result = await db.execute(
            select(VideoChunkModel)
            .where(VideoChunkModel.video_id.in_(video_ids))
            .where(VideoChunkModel.isActive == True)
            .order_by(VideoChunkModel.video_id, VideoChunkModel.chunk_index)
        )
        all_chunks = chunk_result.scalars().all()
        
        # Group chunks by video_id
        chunks_by_video = {}
        for chunk in all_chunks:
            if chunk.video_id not in chunks_by_video:
                chunks_by_video[chunk.video_id] = []
            chunks_by_video[chunk.video_id].append(
                VideoChunk(
                    id=str(chunk.id),
                    video_id=str(chunk.video_id),
                    chunk_index=chunk.chunk_index,
                    filename=chunk.filename,
                    start_time=chunk.start_time,
                    end_time=chunk.end_time,
                    duration=chunk.duration,
                    size=chunk.size,
                    fps=chunk.fps,
                    width=chunk.width,
                    height=chunk.height,
                    is_active=chunk.isActive,
                    created_at=chunk.createdAt,
                    updated_at=chunk.updatedAt,
                )
            )
        
        return [
            Video(
                id=str(video.id),
                title=video.title,
                description=video.description,
                filename=video.filename,
                original_name=video.originalName,
                mime_type=video.mimeType,
                size=video.size,
                duration=video.duration,
                views=video.views or 0,
                is_active=video.isActive,
                is_production=video.isProduction or False,
                total_duration=video.totalDuration,
                case_id=video.caseId,
                source_type=video.sourceType,
                created_at=video.createdAt,
                updated_at=video.updatedAt,
                annotations=annotations_by_video.get(video.id, []),
                chunks=chunks_by_video.get(video.id, []),
            )
            for video in videos
        ]
