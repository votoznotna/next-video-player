export interface Video {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration: number;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  annotations?: Annotation[];
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
