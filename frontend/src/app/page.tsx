'use client';

import React, { useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_VIDEOS } from '@/graphql/queries';
import VideoCard from '@/components/VideoCard';
import VideoPlayerPage from '@/components/VideoPlayerPage';
import { Video } from '@/types';
import { clearAllCache } from '@/lib/cache-utils';

export default function HomePage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const apolloClient = useApolloClient();
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

  if (selectedVideo) {
    return (
      <VideoPlayerPage
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
      />
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Advanced Video Player
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-6'>
            Professional video player with annotations, chapter navigation, and
            advanced controls
          </p>
          <button
            onClick={() => {
              clearAllCache(apolloClient);
              refetch();
            }}
            className='btn btn-secondary text-sm'
            title='Clear all browser cache and refresh data'
          >
            Clear Cache & Refresh
          </button>
        </div>

        {videos.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-gray-400 text-6xl mb-4'>📹</div>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              No Videos Available
            </h2>
            <p className='text-gray-600'>
              Upload some videos to get started with the advanced video player.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {videos.map((video: Video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
