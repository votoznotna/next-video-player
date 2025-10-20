import { gql } from '@apollo/client';

export const GET_VIDEOS = gql`
  query GetVideos {
    videos {
      id
      title
      description
      filename
      originalName
      mimeType
      size
      duration
      views
      isActive
      createdAt
      updatedAt
      annotations {
        id
        title
        description
        startTime
        endTime
        type
        color
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_VIDEO = gql`
  query GetVideo($id: ID!) {
    video(id: $id) {
      id
      title
      description
      filename
      originalName
      mimeType
      size
      duration
      views
      isActive
      createdAt
      updatedAt
      annotations {
        id
        title
        description
        startTime
        endTime
        type
        color
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ANNOTATIONS_BY_VIDEO = gql`
  query GetAnnotationsByVideo($videoId: ID!) {
    annotationsByVideo(videoId: $videoId) {
      id
      title
      description
      startTime
      endTime
      type
      color
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_ANNOTATION = gql`
  mutation CreateAnnotation($createAnnotationInput: CreateAnnotationInput!) {
    createAnnotation(createAnnotationInput: $createAnnotationInput) {
      id
      title
      description
      startTime
      endTime
      type
      color
      isActive
      createdAt
      updatedAt
      videoId
    }
  }
`;

export const UPDATE_ANNOTATION = gql`
  mutation UpdateAnnotation(
    $id: ID!
    $updateAnnotationInput: UpdateAnnotationInput!
  ) {
    updateAnnotation(id: $id, updateAnnotationInput: $updateAnnotationInput) {
      id
      title
      description
      startTime
      endTime
      type
      color
      isActive
      createdAt
      updatedAt
      videoId
    }
  }
`;

export const DELETE_ANNOTATION = gql`
  mutation DeleteAnnotation($id: ID!) {
    removeAnnotation(id: $id)
  }
`;

export const GET_PRODUCTION_VIDEOS = gql`
  query GetProductionVideos {
    productionVideos {
      id
      title
      description
      filename
      originalName
      mimeType
      size
      duration
      totalDuration
      caseId
      sourceType
      views
      isActive
      isProduction
      createdAt
      updatedAt
      chunks {
        id
        filename
        startTime
        endTime
        duration
        chunkIndex
        size
        fps
        width
        height
        isActive
        createdAt
        updatedAt
      }
      annotations {
        id
        title
        description
        startTime
        endTime
        type
        color
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_VIDEO_WITH_CHUNKS = gql`
  query GetVideoWithChunks($id: ID!) {
    video(id: $id) {
      id
      title
      description
      filename
      originalName
      mimeType
      size
      duration
      totalDuration
      caseId
      sourceType
      views
      isActive
      isProduction
      createdAt
      updatedAt
      chunks {
        id
        filename
        startTime
        endTime
        duration
        chunkIndex
        size
        fps
        width
        height
        isActive
        createdAt
        updatedAt
      }
      annotations {
        id
        title
        description
        startTime
        endTime
        type
        color
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;
