"""
API v1 router.
"""

from fastapi import APIRouter

from app.api.api_v1.endpoints import videos, annotations, video_chunks, hls, video_stream

api_router = APIRouter()

api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(annotations.router, prefix="/annotations", tags=["annotations"])
api_router.include_router(video_chunks.router, tags=["video-chunks"])
api_router.include_router(hls.router, tags=["hls-streaming"])
api_router.include_router(video_stream.router, tags=["video-streaming"])
