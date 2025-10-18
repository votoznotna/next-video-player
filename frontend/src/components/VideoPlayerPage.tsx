'use client';

import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { ArrowLeft, Plus, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { GET_ANNOTATIONS_BY_VIDEO } from '@/graphql/queries';
import YouTubeLikePlayer, { YouTubeLikePlayerRef } from './YouTubeLikePlayer';
import AnnotationList from './AnnotationList';
import AddAnnotationForm from './AddAnnotationForm';
import { Video, Annotation } from '@/types';
import { formatDuration, formatFileSize } from '@/lib/utils';

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
  const videoPlayerRef = useRef<YouTubeLikePlayerRef>(null);
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
  }, [apolloClient, video.id]);

  const annotations = data?.annotationsByVideo || [];

  const handleAnnotationClick = (annotation: Annotation) => {
    // Set the selected annotation
    setSelectedAnnotationId(annotation.id);

    // Seek to annotation start time
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(annotation.startTime);
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
              <h1 className='text-xl font-semibold text-gray-900'>
                YouTube-like Video Player
              </h1>
            </div>

            <div className='flex items-center space-x-4'>
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

            <YouTubeLikePlayer
              ref={videoPlayerRef}
              video={video}
              onTimeUpdate={handleTimeUpdate}
              onAnnotationClick={handleAnnotationClick}
              onClearAnnotationSelection={() =>
                setSelectedAnnotationId(undefined)
              }
              selectedAnnotationId={selectedAnnotationId}
            />
          </div>

          {/* Annotations Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm border p-6'>
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
