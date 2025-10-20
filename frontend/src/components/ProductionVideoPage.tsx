'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_PRODUCTION_VIDEOS,
  GET_VIDEO_WITH_CHUNKS,
  GET_ANNOTATIONS_BY_VIDEO,
} from '../graphql/queries';
import ProductionVideoPlayer, {
  ProductionVideoPlayerRef,
} from './ProductionVideoPlayer';
import AnnotationList from './AnnotationList';

interface VideoChunk {
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
  url: string;
}

interface Video {
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
  isProduction: boolean;
  createdAt: string;
  updatedAt: string;
  chunks: VideoChunk[];
}

interface Annotation {
  id: string;
  title: string;
  description?: string;
  startTime: number;
  endTime?: number;
  type: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProductionVideoPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | undefined
  >();
  const [currentTime, setCurrentTime] = useState(0);
  const videoPlayerRef = useRef<ProductionVideoPlayerRef>(null);

  // Fetch production videos
  const {
    data: videosData,
    loading: videosLoading,
    error: videosError,
  } = useQuery(GET_PRODUCTION_VIDEOS, {
    fetchPolicy: 'cache-and-network',
  });

  // Handle data loading and errors with useEffect
  useEffect(() => {
    if (videosData) {
      console.log('Production videos loaded:', videosData);
    }
  }, [videosData]);

  useEffect(() => {
    if (videosError) {
      console.error('Error loading production videos:', videosError);
    }
  }, [videosError]);

  // Fetch selected video with chunks
  const { data: videoData, loading: videoLoading } = useQuery(
    GET_VIDEO_WITH_CHUNKS,
    {
      variables: { id: selectedVideo?.id },
      skip: !selectedVideo?.id,
      fetchPolicy: 'cache-and-network',
    }
  );

  // Fetch annotations for the selected video
  const { data: annotationsData, loading: annotationsLoading } = useQuery(
    GET_ANNOTATIONS_BY_VIDEO,
    {
      variables: { videoId: selectedVideo?.id },
      skip: !selectedVideo?.id,
      fetchPolicy: 'cache-and-network',
    }
  );

  const videos = videosData?.productionVideos || [];
  const currentVideo = videoData?.video || selectedVideo;
  const annotations = annotationsData?.annotationsByVideo || [];

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setSelectedAnnotationId(undefined);
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotationId(annotation.id);
    // Note: Seeking is handled by the timeline click handler, not here
  };

  const handleClearAnnotationSelection = () => {
    setSelectedAnnotationId(undefined);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  if (videosLoading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-white text-xl'>Loading production videos...</div>
      </div>
    );
  }

  if (videosError) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-red-400 text-xl'>
          Error loading production videos: {videosError.message}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-white text-xl mb-4'>
            No Production Videos Found
          </div>
          <div className='text-gray-400'>
            Production videos are 5-minute chunks stored in NFS.
            <br />
            Please ensure video files are properly indexed in the database.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900'>
      {/* Header */}
      <div className='bg-gray-800 border-b border-gray-700 p-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-white'>Demo (Video Player)</h1>
          <div className='flex items-center space-x-4'>
            <div className='text-gray-400'>
              {videos.length} production video{videos.length !== 1 ? 's' : ''}{' '}
              available
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto p-6'>
        {!selectedVideo ? (
          /* Video Selection */
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-white mb-4'>
              Select a Production Video
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {videos.map((video: Video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className='bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700'
                >
                  <h3 className='text-lg font-semibold text-white mb-2'>
                    {video.title}
                  </h3>
                  <p className='text-gray-400 text-sm mb-4'>
                    {video.description}
                  </p>

                  <div className='space-y-2 text-sm text-gray-300'>
                    <div className='flex justify-between'>
                      <span>Case ID:</span>
                      <span className='text-blue-400'>
                        {video.caseId || 'N/A'}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Duration:</span>
                      <span>
                        {Math.round(video.totalDuration || video.duration)}s
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Chunks:</span>
                      <span>{video.chunks.length}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Source:</span>
                      <span className='text-green-400'>
                        {video.sourceType || 'NFS'}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Created:</span>
                      <span>
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Video Player */
          <div className='space-y-6'>
            {videoLoading ? (
              <div className='text-white text-center py-8'>
                Loading video details...
              </div>
            ) : currentVideo ? (
              <>
                {/* Video Info */}
                <div className='bg-gray-800 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-2'>
                    <h2 className='text-xl font-semibold text-white'>
                      {currentVideo.title}
                    </h2>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className='text-gray-400 hover:text-white transition-colors'
                    >
                      ← Back to Videos
                    </button>
                  </div>
                  <p className='text-gray-400 mb-4'>
                    {currentVideo.description}
                  </p>

                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-500'>Case ID:</span>
                      <span className='text-blue-400 ml-2'>
                        {currentVideo.caseId || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Duration:</span>
                      <span className='text-white ml-2'>
                        {Math.round(
                          currentVideo.totalDuration || currentVideo.duration
                        )}
                        s
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Chunks:</span>
                      <span className='text-white ml-2'>
                        {currentVideo.chunks.length}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-500'>Source:</span>
                      <span className='text-green-400 ml-2'>
                        {currentVideo.sourceType || 'NFS'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Content - Side by Side Layout */}
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
                  {/* Left Side - Video Player and Chunks */}
                  <div className='xl:col-span-2 space-y-6'>
                    {/* Video Player */}
                    <div className='max-w-4xl'>
                      <ProductionVideoPlayer
                        ref={videoPlayerRef}
                        video={currentVideo}
                        onTimeUpdate={handleTimeUpdate}
                        onAnnotationClick={handleAnnotationClick}
                        onClearAnnotationSelection={
                          handleClearAnnotationSelection
                        }
                        selectedAnnotationId={selectedAnnotationId}
                      />
                    </div>

                    {/* Video Chunks */}
                    <div>
                      <h3 className='text-lg font-semibold text-white mb-4'>
                        Video Chunks
                      </h3>
                      <div className='bg-gray-800 rounded-lg p-4'>
                        <div className='space-y-2'>
                          {currentVideo.chunks.map(
                            (chunk: any, index: number) => (
                              <div
                                key={chunk.id}
                                className='flex items-center justify-between bg-gray-700 rounded p-3'
                              >
                                <div className='flex items-center space-x-3'>
                                  <span className='text-blue-400 font-mono text-sm'>
                                    #{index + 1}
                                  </span>
                                  <span className='text-white text-sm'>
                                    {chunk.filename}
                                  </span>
                                </div>
                                <div className='text-gray-400 text-sm'>
                                  {Math.round(chunk.startTime)}s -{' '}
                                  {Math.round(chunk.endTime)}s
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Annotations */}
                  <div className='xl:col-span-1'>
                    <AnnotationList
                      annotations={annotations}
                      currentTime={currentTime}
                      onAnnotationClick={handleAnnotationClick}
                      onSeekToTime={(time) => {
                        if (videoPlayerRef.current) {
                          videoPlayerRef.current.seekTo(time);
                        }
                      }}
                      selectedAnnotationId={selectedAnnotationId}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className='text-white text-center py-8'>Video not found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionVideoPage;
