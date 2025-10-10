"""
API v1 router.
"""

from fastapi import APIRouter

from app.api.api_v1.endpoints import videos, annotations

api_router = APIRouter()

api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(annotations.router, prefix="/annotations", tags=["annotations"])
