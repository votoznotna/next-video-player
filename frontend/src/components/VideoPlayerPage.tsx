'use client';

import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { ArrowLeft, Plus, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { GET_ANNOTATIONS_BY_VIDEO } from '@/graphql/queries';
import VideoPlayer, { VideoPlayerRef } from './VideoPlayer';
import AnnotationList from './AnnotationList';
import AddAnnotationForm from './AddAnnotationForm';
import { Video, Annotation } from '@/types';
import { formatDuration, formatFileSize } from '@/lib/utils';
import { clearAllCache } from '@/lib/cache-utils';

interface VideoPlayerPageProps {
  video: Video;
  onBack: () => void;
}

export default function VideoPlayerPage({
  video,
  onBack,
}: VideoPlayerPageProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [showAnnotationForm, setShowAnnotationForm] = useState(false);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<
    string | undefined
  >(undefined);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const apolloClient = useApolloClient();

  const { data, loading, error, refetch } = useQuery(GET_ANNOTATIONS_BY_VIDEO, {
    variables: { videoId: video.id },
    fetchPolicy: 'cache-and-network', // Always fetch fresh data
    notifyOnNetworkStatusChange: true,
  });

  // Clear cache when component mounts to ensure fresh data
  useEffect(() => {
    // Clear Apollo cache
    apolloClient.cache.evict({ fieldName: 'annotationsByVideo' });
    apolloClient.cache.gc();

    // Set up global cache clearing function
    (window as any).clearVideoPlayerCacheWithApollo = () => {
      clearAllCache(apolloClient);
      // Force refetch
      refetch();
    };
  }, [apolloClient, video.id, refetch]);

  const annotations = data?.annotationsByVideo || [];

  const handleAnnotationClick = (annotation: Annotation) => {
    // Debug: log the clicked annotation
    console.log('Clicked annotation:', annotation.title, 'ID:', annotation.id);
    console.log('Setting selectedAnnotationId to:', annotation.id);

    // Set the selected annotation
    setSelectedAnnotationId(annotation.id);
    console.log('selectedAnnotationId state updated to:', annotation.id);

    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(annotation.startTime);
      setCurrentTime(annotation.startTime);
    }
  };

  const handleSeekToTime = (time: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(time);
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    // For now, let's keep manual selection persistent
    // We can add time-based clearing later if needed
  };

  const handleAnnotationCreated = () => {
    refetch(); // Refresh the annotations list
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={onBack}
                className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
              >
                <ArrowLeft size={20} />
                <span>Back to Videos</span>
              </button>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={() => {
                  clearAllCache(apolloClient);
                  refetch();
                  setSelectedAnnotationId(undefined);
                }}
                className='btn btn-secondary flex items-center space-x-2'
                title='Clear all cache and refresh data'
              >
                <RefreshCw size={16} />
                <span>Clear Cache</span>
              </button>
              <button
                onClick={() => setShowAnnotationForm(true)}
                className='btn btn-primary flex items-center space-x-2'
              >
                <Plus size={16} />
                <span>Add Annotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Video Player */}
          <div className='lg:col-span-2'>
            <div className='card p-6'>
              <div className='mb-4'>
                <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                  {video.title}
                </h1>
                {video.description && (
                  <p className='text-gray-600 mb-4'>{video.description}</p>
                )}

                <div className='flex items-center space-x-6 text-sm text-gray-500'>
                  <span>Duration: {formatDuration(video.duration)}</span>
                  <span>Size: {formatFileSize(video.size)}</span>
                  <span>Views: {video.views}</span>
                </div>
              </div>

              <div className='aspect-video'>
                <VideoPlayer
                  ref={videoPlayerRef}
                  video={video}
                  annotations={annotations}
                  onAnnotationClick={handleAnnotationClick}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            </div>
          </div>

          {/* Annotations Sidebar */}
          <div className='lg:col-span-1'>
            <div className='card p-6'>
              {loading ? (
                <div className='text-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
                  <p className='text-gray-600'>Loading annotations...</p>
                </div>
              ) : error ? (
                <div className='text-center py-8'>
                  <div className='text-red-500 text-4xl mb-4'>⚠️</div>
                  <p className='text-gray-600 mb-4'>
                    Error loading annotations
                  </p>
                  <button onClick={() => refetch()} className='btn btn-primary'>
                    Retry
                  </button>
                </div>
              ) : (
                <AnnotationList
                  annotations={annotations}
                  currentTime={currentTime}
                  onAnnotationClick={handleAnnotationClick}
                  onSeekToTime={handleSeekToTime}
                  selectedAnnotationId={selectedAnnotationId}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Annotation Form Modal */}
      {showAnnotationForm && (
        <AddAnnotationForm
          videoId={video.id}
          currentTime={currentTime}
          onClose={() => setShowAnnotationForm(false)}
          onSuccess={handleAnnotationCreated}
        />
      )}
    </div>
  );
}
