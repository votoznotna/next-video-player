'use client';

import React from 'react';
import { Clock, Play } from 'lucide-react';
import { Annotation } from '@/types';
import { formatDuration } from '@/lib/utils';

interface AnnotationListProps {
  annotations: Annotation[];
  currentTime: number;
  onAnnotationClick: (annotation: Annotation) => void;
  onSeekToTime: (time: number) => void;
  selectedAnnotationId?: string;
}

export default function AnnotationList({
  annotations,
  currentTime,
  onAnnotationClick,
  onSeekToTime,
  selectedAnnotationId,
}: AnnotationListProps) {
  // Simple selection logic - just use the selectedAnnotationId directly
  const isAnnotationSelected = (annotation: Annotation) => {
    const isSelected = selectedAnnotationId === annotation.id;
    return isSelected;
  };

  const isAnnotationActive = (annotation: Annotation) => {
    return (
      currentTime >= annotation.startTime && currentTime <= annotation.endTime
    );
  };

  const getAnnotationProgress = (annotation: Annotation) => {
    if (currentTime < annotation.startTime) return 0;
    if (currentTime > annotation.endTime) return 100;
    return (
      ((currentTime - annotation.startTime) /
        (annotation.endTime - annotation.startTime)) *
      100
    );
  };

  return (
    <div className='space-y-3'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Chapters & Annotations
      </h3>

      {annotations.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Clock size={48} className='mx-auto mb-4 opacity-50' />
          <p>No annotations available for this video.</p>
        </div>
      ) : (
        <div className='space-y-2'>
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isAnnotationSelected(annotation)
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onAnnotationClick(annotation)}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: annotation.color }}
                    />
                    <h4 className='font-medium text-gray-900'>
                      {annotation.title}
                    </h4>
                    <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                      {annotation.type}
                    </span>
                  </div>

                  {annotation.description && (
                    <p className='text-sm text-gray-600 mb-2'>
                      {annotation.description}
                    </p>
                  )}

                  <div className='flex items-center space-x-4 text-xs text-gray-500'>
                    <span className='flex items-center space-x-1'>
                      <Clock size={12} />
                      <span>
                        {formatDuration(annotation.startTime)} -{' '}
                        {formatDuration(annotation.endTime)}
                      </span>
                    </span>
                    <span>
                      Duration:{' '}
                      {formatDuration(
                        annotation.endTime - annotation.startTime
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeekToTime(annotation.startTime);
                  }}
                  className='ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors'
                  title='Jump to start'
                >
                  <Play size={16} />
                </button>
              </div>

              {/* Progress bar for selected annotation */}
              {isAnnotationSelected(annotation) && (
                <div className='mt-3'>
                  <div className='w-full bg-gray-200 rounded-full h-1'>
                    <div
                      className='h-1 rounded-full transition-all duration-300'
                      style={{
                        width: `${getAnnotationProgress(annotation)}%`,
                        backgroundColor: annotation.color,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
