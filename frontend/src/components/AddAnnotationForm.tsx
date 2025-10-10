'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { X, Save, Clock } from 'lucide-react';
import { CREATE_ANNOTATION } from '@/graphql/queries';
import { CreateAnnotationInput } from '@/types';

interface AddAnnotationFormProps {
  videoId: string;
  currentTime: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ANNOTATION_TYPES = [
  { value: 'chapter', label: 'Chapter', color: '#3B82F6' },
  { value: 'note', label: 'Note', color: '#10B981' },
  { value: 'highlight', label: 'Highlight', color: '#F59E0B' },
  { value: 'bookmark', label: 'Bookmark', color: '#EF4444' },
];

export default function AddAnnotationForm({
  videoId,
  currentTime,
  onClose,
  onSuccess,
}: AddAnnotationFormProps) {
  const [formData, setFormData] = useState<CreateAnnotationInput>({
    title: '',
    description: '',
    startTime: currentTime,
    endTime: currentTime + 30, // Default 30 seconds duration
    type: 'chapter',
    color: '#3B82F6',
    videoId,
  });

  const [createAnnotation, { loading }] = useMutation(CREATE_ANNOTATION, {
    onCompleted: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error('Error creating annotation:', error);
    },
    refetchQueries: ['GetAnnotationsByVideo'], // Refetch annotations after creation
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    createAnnotation({
      variables: {
        createAnnotationInput: {
          ...formData,
          title: formData.title.trim(),
          description: formData.description?.trim() || undefined,
        },
      },
    });
  };

  const handleTypeChange = (type: string) => {
    const typeConfig = ANNOTATION_TYPES.find((t) => t.value === type);
    setFormData((prev) => ({
      ...prev,
      type,
      color: typeConfig?.color || '#3B82F6',
    }));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Add Annotation
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Current Time Display */}
          <div className='flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded'>
            <Clock size={16} />
            <span>
              Current time: {Math.floor(currentTime / 60)}:
              {(currentTime % 60).toFixed(0).padStart(2, '0')}
            </span>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Title *
            </label>
            <input
              type='text'
              id='title'
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter annotation title'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Enter annotation description (optional)'
              rows={3}
            />
          </div>

          {/* Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Type
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {ANNOTATION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type='button'
                  onClick={() => handleTypeChange(type.value)}
                  className={`p-3 text-sm rounded-md border transition-colors ${
                    formData.type === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center space-x-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: type.color }}
                    />
                    <span>{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='startTime'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Start Time (seconds)
              </label>
              <input
                type='number'
                id='startTime'
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: parseFloat(e.target.value) || 0,
                  }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min='0'
                step='0.1'
              />
            </div>
            <div>
              <label
                htmlFor='endTime'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                End Time (seconds)
              </label>
              <input
                type='number'
                id='endTime'
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endTime: parseFloat(e.target.value) || 0,
                  }))
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min='0'
                step='0.1'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading || !formData.title.trim()}
              className='btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Save size={16} />
              <span>{loading ? 'Creating...' : 'Create Annotation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
