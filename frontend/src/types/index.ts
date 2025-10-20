export interface VideoChunk {
  id: string;
  filename: string;
  startTime: number;
  endTime: number;
  duration: number;
  chunkIndex: number;
  size: number;
  fps?: number;
  width?: number;
  height?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  url?: string; // Added for ProductionVideoPlayer compatibility
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration: number;
  totalDuration?: number;
  caseId?: string;
  sourceType?: string;
  views: number;
  isActive: boolean;
  isProduction?: boolean;
  createdAt: string;
  updatedAt: string;
  annotations?: Annotation[];
  chunks?: VideoChunk[];
}

export interface Annotation {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  type: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  videoId: string;
  video?: Video;
}

export interface CreateAnnotationInput {
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  type?: string;
  color?: string;
  isActive?: boolean;
  videoId: string;
}

export interface UpdateAnnotationInput {
  title?: string;
  description?: string;
  startTime?: number;
  endTime?: number;
  type?: string;
  color?: string;
  isActive?: boolean;
}
