'use client';

import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useQuery } from '@apollo/client';
import { Video } from '@/types';
import { GET_ANNOTATIONS_BY_VIDEO } from '@/graphql/queries';

interface YouTubeLikePlayerProps {
  video: Video;
  onTimeUpdate?: (time: number) => void;
  onAnnotationClick?: (annotation: any) => void;
  onClearAnnotationSelection?: () => void;
  selectedAnnotationId?: string;
}

export interface YouTubeLikePlayerRef {
  seekTo: (time: number) => void;
}

const YouTubeLikePlayer = forwardRef<
  YouTubeLikePlayerRef,
  YouTubeLikePlayerProps
>(
  (
    {
      video,
      onTimeUpdate,
      onAnnotationClick,
      onClearAnnotationSelection,
      selectedAnnotationId,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Video state
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Timeline and preview state
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewPosition, setPreviewPosition] = useState(0);
    const [framePreview, setFramePreview] = useState<string | null>(null);

    // Fetch annotations
    const { data: annotationsData } = useQuery(GET_ANNOTATIONS_BY_VIDEO, {
      variables: { videoId: video.id },
      fetchPolicy: 'cache-and-network',
    });

    const annotations = annotationsData?.annotationsByVideo || [];

    // Debug: log props only when they change (disabled to reduce noise)
    // useEffect(() => {
    //   console.log('YouTubeLikePlayer props updated:', {
    //     onAnnotationClick: !!onAnnotationClick,
    //     selectedAnnotationId,
    //     annotationsCount: annotations.length,
    //   });
    // }, [onAnnotationClick, selectedAnnotationId, annotations.length]);

    // Expose seekTo method to parent component
    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
          setCurrentTime(time);
        }
      },
    }));

    // Video event handlers
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        // console.log('Video loaded - Duration:', video.duration);
      };

      const handleTimeUpdate = () => {
        if (!isSeeking && video.currentTime !== currentTime) {
          setCurrentTime(video.currentTime);
          onTimeUpdate?.(video.currentTime);
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleSeeked = () => {
        // console.log('Video seeked to:', video.currentTime);
        setCurrentTime(video.currentTime);
        setIsSeeking(false);
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('seeked', handleSeeked);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('seeked', handleSeeked);
      };
    }, [isSeeking]);

    // Generate frame preview
    const generateFramePreview = async (time: number) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/videos/${video.id}/frame/${time}`
        );
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setFramePreview(url);
        } else {
          // Fallback to time/chunk info
          setFramePreview(null);
        }
      } catch (error) {
        // console.log('Frame preview failed, using fallback');
        setFramePreview(null);
      }
    };

    // Timeline interaction handlers
    const handleTimelineMouseMove = (e: React.MouseEvent) => {
      if (!progressBarRef.current || !duration) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const time = percentage * duration;

      setHoverTime(time);
      setPreviewPosition(percentage * 100);
      setShowPreview(true);

      // Generate frame preview with debouncing
      clearTimeout((window as any).previewTimeout);
      (window as any).previewTimeout = setTimeout(() => {
        generateFramePreview(time);
      }, 100);
    };

    const handleTimelineMouseLeave = () => {
      setShowPreview(false);
      setHoverTime(null);
      setFramePreview(null);
      clearTimeout((window as any).previewTimeout);
    };

    const handleSeek = (e: React.MouseEvent) => {
      if (!progressBarRef.current || !videoRef.current || !duration) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;

      // console.log('Seek clicked:', {
      //   clickX,
      //   percentage,
      //   newTime,
      //   duration,
      //   videoCurrentTime: videoRef.current.currentTime,
      //   videoDuration: videoRef.current.duration,
      //   videoReadyState: videoRef.current.readyState,
      //   videoNetworkState: videoRef.current.networkState,
      //   videoPaused: videoRef.current.paused,
      //   videoEnded: videoRef.current.ended,
      //   videoSeeking: videoRef.current.seeking,
      // });

      setIsSeeking(true);
      setCurrentTime(newTime);

      // Determine which annotation interval was clicked
      if (annotations.length > 0) {
        const intervalWidth = 100 / annotations.length;
        const clickedIntervalIndex =
          Math.ceil((percentage * 100) / intervalWidth) - 1;
        const clampedIndex = Math.max(
          0,
          Math.min(clickedIntervalIndex, annotations.length - 1)
        );
        const selectedAnnotation = annotations[clampedIndex];

        if (selectedAnnotation) {
          // console.log(`Clicked interval ${clampedIndex + 1}/${annotations.length}, selecting annotation:`, selectedAnnotation.title);
          onAnnotationClick?.(selectedAnnotation);
        }
      } else {
        // No annotations available, clear selection
        onClearAnnotationSelection?.();
      }

      // Simple seeking
      videoRef.current.currentTime = newTime;
    };

    const togglePlay = () => {
      if (!videoRef.current) return;

      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    return (
      <div className='w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden'>
        {/* Video Element */}
        <div className='relative'>
          <video
            ref={videoRef}
            className='w-full h-auto'
            src={
              video.isProduction
                ? `http://localhost:8000/api/v1/videos/${video.id}/stream`
                : `http://localhost:8000/videos/${video.filename}`
            }
            preload='metadata'
            crossOrigin='anonymous'
          />

          {/* Play/Pause Overlay */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <button
              onClick={togglePlay}
              className='bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-4 transition-all'
            >
              {isPlaying ? (
                <svg
                  className='w-12 h-12 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
                </svg>
              ) : (
                <svg
                  className='w-12 h-12 text-white'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
              )}
            </button>
          </div>

          {/* Frame Preview Tooltip */}
          {showPreview && hoverTime !== null && (
            <div
              className='absolute bottom-16 bg-black bg-opacity-90 rounded-lg p-2 pointer-events-none z-20'
              style={{
                left: `${previewPosition}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {framePreview ? (
                <img
                  src={framePreview}
                  alt='Frame preview'
                  className='w-32 h-18 object-cover rounded'
                />
              ) : (
                <div className='w-32 h-18 bg-gray-700 rounded flex items-center justify-center text-white text-xs'>
                  <div className='text-center'>
                    <div>Time: {formatTime(hoverTime)}</div>
                    <div>Chunk: {Math.floor(hoverTime / 120) + 1}/15</div>
                  </div>
                </div>
              )}
              <div className='text-white text-xs mt-1 text-center'>
                {formatTime(hoverTime)}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className='bg-gray-900 p-4'>
          {/* Progress Bar */}
          <div className='mb-4'>
            <div
              ref={progressBarRef}
              className='relative h-4 bg-gray-600 rounded cursor-pointer hover:h-5 transition-all border border-gray-400 z-10'
              onMouseMove={handleTimelineMouseMove}
              onMouseLeave={handleTimelineMouseLeave}
              onClick={handleSeek}
            >
              {/* Progress */}
              <div
                className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded shadow-md transition-all duration-100'
                style={{ width: `${Math.max(0.5, progressPercentage)}%` }}
              />

              {/* Selected Timeline Intervals */}
              {selectedAnnotationId &&
                annotations.length > 0 &&
                (() => {
                  const selectedAnnotationIndex = annotations.findIndex(
                    (ann: any) => ann.id === selectedAnnotationId
                  );
                  if (selectedAnnotationIndex >= 0) {
                    const intervalsToShow = selectedAnnotationIndex + 1;
                    const intervalWidth = 100 / annotations.length;

                    return Array.from(
                      { length: intervalsToShow },
                      (_, index) => (
                        <div
                          key={`selected-interval-${index}`}
                          className='absolute top-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded shadow-md transition-all duration-300 opacity-80'
                          style={{
                            left: `${index * intervalWidth}%`,
                            width: `${intervalWidth}%`,
                            zIndex: 3,
                          }}
                        />
                      )
                    );
                  }
                  return null;
                })()}

              {/* Current time cursor */}
              <div
                className='absolute top-0 w-2 h-full bg-white border-2 border-blue-500 rounded shadow-lg shadow-blue-500/50 z-10'
                style={{
                  left: `${progressPercentage}%`,
                  transform: 'translateX(-50%)',
                }}
              />

              {/* Hover preview indicator */}
              {showPreview && (
                <div
                  className='absolute top-0 w-2 h-full bg-yellow-400 border-2 border-yellow-600 rounded shadow-lg shadow-yellow-400/50 z-15'
                  style={{
                    left: `${previewPosition}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
            </div>
          </div>

          {/* Control buttons */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={togglePlay}
                className='text-white hover:text-blue-400'
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <div className='text-white text-sm'>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Annotation Selection Indicator */}
              {selectedAnnotationId &&
                annotations.length > 0 &&
                (() => {
                  const selectedAnnotationIndex = annotations.findIndex(
                    (ann: any) => ann.id === selectedAnnotationId
                  );
                  const selectedAnnotation =
                    annotations[selectedAnnotationIndex];
                  if (selectedAnnotation) {
                    return (
                      <div className='text-green-400 text-sm font-medium'>
                        Selected: {selectedAnnotation.title} (
                        {selectedAnnotationIndex + 1}/{annotations.length})
                      </div>
                    );
                  }
                  return null;
                })()}
            </div>

            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <span className='text-white text-sm'>Speed:</span>
                <select
                  value={playbackRate}
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    setPlaybackRate(rate);
                    if (videoRef.current) {
                      videoRef.current.playbackRate = rate;
                    }
                  }}
                  className='bg-gray-700 text-white rounded px-2 py-1 text-sm'
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>

              <div className='flex items-center space-x-2'>
                <span className='text-white text-sm'>🔊</span>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.1'
                  value={volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setVolume(vol);
                    if (videoRef.current) {
                      videoRef.current.volume = vol;
                    }
                  }}
                  className='w-20'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

YouTubeLikePlayer.displayName = 'YouTubeLikePlayer';

export default YouTubeLikePlayer;
