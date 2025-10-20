"""
GraphQL Schema using Strawberry
"""
import strawberry
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.graphql.types import Video, Annotation, CreateAnnotationInput
from app.graphql.resolvers import get_videos, get_video, get_annotations_by_video, create_annotation, get_production_videos


@strawberry.type
class Query:
    videos: List[Video] = strawberry.field(resolver=get_videos)
    video: Optional[Video] = strawberry.field(resolver=get_video)
    production_videos: List[Video] = strawberry.field(
        resolver=get_production_videos,
        name="productionVideos"
    )
    annotations_by_video: List[Annotation] = strawberry.field(
        resolver=get_annotations_by_video,
        name="annotationsByVideo"
    )


@strawberry.type
class Mutation:
    create_annotation: Annotation = strawberry.field(
        resolver=create_annotation,
        name="createAnnotation"
    )


schema = strawberry.Schema(query=Query, mutation=Mutation)
