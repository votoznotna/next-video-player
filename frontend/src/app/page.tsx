'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_VIDEOS } from '@/graphql/queries';
import VideoPlayerPage from '@/components/VideoPlayerPage';
import { Video } from '@/types';

export default function HomePage() {
  const { data, loading, error, refetch } = useQuery(GET_VIDEOS, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-500 text-6xl mb-4'>⚠️</div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Error Loading Videos
          </h2>
          <p className='text-gray-600 mb-4'>{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className='btn btn-primary'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const videos = data?.videos || [];

  // Show the first video directly, or show error if no videos
  if (videos.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-gray-400 text-6xl mb-4'>📹</div>
          <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
            No Videos Available
          </h2>
          <p className='text-gray-600'>
            Upload some videos to get started with the advanced video player.
          </p>
        </div>
      </div>
    );
  }

  // Show the first video directly
  const firstVideo = videos[0];
  return (
    <VideoPlayerPage
      video={firstVideo}
      onBack={() => {}} // No back button needed since we're showing directly
    />
  );
}
