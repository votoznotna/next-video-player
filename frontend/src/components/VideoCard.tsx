'use client';

import React from 'react';
import { Play, Clock, Eye } from 'lucide-react';
import { Video } from '@/types';
import { formatDuration, formatFileSize } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div
      className='card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105'
      onClick={onClick}
    >
      <div className='aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80' />
        <div className='relative z-10 text-white text-center'>
          <Play size={48} className='mx-auto mb-2' />
          <p className='text-sm font-medium'>{video.title}</p>
        </div>

        {/* Duration overlay */}
        <div className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='font-semibold text-gray-900 line-clamp-2'>
          {video.title}
        </h3>

        {video.description && (
          <p className='text-sm text-gray-600 line-clamp-2'>
            {video.description}
          </p>
        )}

        <div className='flex items-center justify-between text-xs text-gray-500'>
          <div className='flex items-center space-x-4'>
            <span className='flex items-center space-x-1'>
              <Eye size={12} />
              <span>{video.views} views</span>
            </span>
            <span className='flex items-center space-x-1'>
              <Clock size={12} />
              <span>{formatDuration(video.duration)}</span>
            </span>
          </div>
          <span>{formatFileSize(video.size)}</span>
        </div>

        {video.annotations && video.annotations.length > 0 && (
          <div className='mt-2'>
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
              {video.annotations.length} chapters
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
