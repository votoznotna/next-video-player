'use client';

import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useQuery } from '@apollo/client';
import { GET_VIDEOS, GET_ANNOTATIONS_BY_VIDEO } from '../graphql/queries';
import { Annotation, Video, VideoChunk } from '@/types';

interface ProductionVideoPlayerProps {
  video: Video;
  onTimeUpdate?: (time: number) => void;
  onAnnotationClick?: (annotation: Annotation) => void;
  onClearAnnotationSelection?: () => void;
  selectedAnnotationId?: string;
}

export interface ProductionVideoPlayerRef {
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getCurrentChunk: () => VideoChunk | null;
}

const ProductionVideoPlayer = forwardRef<
  ProductionVideoPlayerRef,
  ProductionVideoPlayerProps
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
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [displayTime, setDisplayTime] = useState(0); // Time to display for cursor
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isSeeking, setIsSeeking] = useState(false);
    const [justSeeked, setJustSeeked] = useState(false); // Track if we just performed a seek

    // Current chunk state
    const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
    const [currentChunk, setCurrentChunk] = useState<VideoChunk | null>(null);

    // Timeline and preview state
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewPosition, setPreviewPosition] = useState(0);
    const [framePreview, setFramePreview] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const framePreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch annotations
    const { data: annotationsData } = useQuery(GET_ANNOTATIONS_BY_VIDEO, {
      variables: { videoId: video.id },
      fetchPolicy: 'cache-and-network',
    });

    const annotations = annotationsData?.annotationsByVideo || [];

    // Debug annotations fetch (only log once when data changes)
    if (annotationsData && annotations.length === 0) {
      console.log(
        'ProductionVideoPlayer: No annotations found for video:',
        video.id
      );
    }

    // Initialize current chunk
    useEffect(() => {
      if (video.chunks && video.chunks.length > 0) {
        const firstChunk = video.chunks[0];
        // Generate URL for the chunk
        const chunkWithUrl = {
          ...firstChunk,
          url: `http://localhost:8000/api/v1/production/${firstChunk.filename}`,
        };
        setCurrentChunk(chunkWithUrl);
        setDuration(video.totalDuration || video.duration);

        // Load the video when chunk is set
        if (videoRef.current) {
          videoRef.current.src = chunkWithUrl.url;
          videoRef.current.load();
        }
      }
    }, [video.chunks, video.totalDuration, video.duration]);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        handleSeekToTime(time);
      },
      getCurrentTime: () => currentTime,
      getCurrentChunk: () => currentChunk,
    }));

    // Find the correct chunk for a given time
    const findChunkForTime = (
      time: number
    ): { chunk: VideoChunk; localTime: number } | null => {
      if (!video.chunks) return null;
      for (let i = 0; i < video.chunks.length; i++) {
        const chunk = video.chunks[i];
        if (time >= chunk.startTime && time <= chunk.endTime) {
          const localTime = time - chunk.startTime;
          return { chunk, localTime };
        }
      }
      return null;
    };

    // Handle seeking to a specific time across chunks
    const handleSeekToTime = (time: number) => {
      const chunkInfo = findChunkForTime(time);
      if (!chunkInfo || !videoRef.current) return;

      const { chunk, localTime } = chunkInfo;
      const wasPlaying = !videoRef.current.paused;

      console.log('handleSeekToTime called:', {
        targetTime: time.toFixed(1),
        targetChunkIndex: chunk.chunkIndex,
        targetChunkStartTime: chunk.startTime.toFixed(1),
        targetChunkEndTime: chunk.endTime.toFixed(1),
        calculatedLocalTime: localTime.toFixed(1),
        currentChunkIndex: currentChunk?.chunkIndex,
        needsChunkSwitch: currentChunk?.id !== chunk.id,
        wasPlaying,
      });

      // If we need to switch chunks
      if (currentChunk?.id !== chunk.id) {
        const chunkWithUrl = {
          ...chunk,
          url: `http://localhost:8000/api/v1/production/${chunk.filename}`,
        };
        setCurrentChunk(chunkWithUrl);
        setCurrentChunkIndex(
          video.chunks?.findIndex((c) => c.id === chunk.id) || 0
        );

        // Preserve playback rate when switching chunks
        const currentPlaybackRate = videoRef.current.playbackRate;

        // Update video source
        videoRef.current.src = chunkWithUrl.url;
        videoRef.current.load();

        // Wait for video to load, then seek and resume playing if it was playing
        videoRef.current.addEventListener(
          'loadeddata',
          () => {
            if (videoRef.current) {
              // Restore playback rate first
              videoRef.current.playbackRate = currentPlaybackRate;

              // Ensure the video is ready for seeking
              if (videoRef.current.readyState >= 2) {
                console.log('Video properties before seek:', {
                  readyState: videoRef.current.readyState,
                  networkState: videoRef.current.networkState,
                  duration: videoRef.current.duration,
                  currentTime: videoRef.current.currentTime,
                  src: videoRef.current.src,
                  seekable:
                    videoRef.current.seekable.length > 0
                      ? {
                          start: videoRef.current.seekable.start(0),
                          end: videoRef.current.seekable.end(0),
                        }
                      : 'No seekable ranges',
                });

                videoRef.current.currentTime = localTime;
                console.log('Set video currentTime to:', localTime.toFixed(1));

                // Wait for the seek to actually take effect
                setTimeout(() => {
                  console.log(
                    'Video currentTime after seek:',
                    videoRef.current?.currentTime.toFixed(1)
                  );
                  setCurrentTime(time);
                  setIsSeeking(false);
                  // Resume playing if it was playing before
                  if (wasPlaying) {
                    videoRef.current?.play().catch(console.warn);
                  }
                }, 50);
              }
            }
          },
          { once: true }
        );
      } else {
        // Same chunk, just seek
        videoRef.current.currentTime = localTime;
        console.log(
          'Set video currentTime to (same chunk):',
          localTime.toFixed(1)
        );

        // Wait for the seek to actually take effect
        setTimeout(() => {
          console.log(
            'Video currentTime after seek (same chunk):',
            videoRef.current?.currentTime.toFixed(1)
          );
          setCurrentTime(time);
          setIsSeeking(false);
          // Resume playing if it was playing before
          if (wasPlaying) {
            videoRef.current?.play().catch(console.warn);
          }
        }, 50);
      }
    };

    // Handle chunk transitions
    const handleChunkTransition = () => {
      if (video.chunks && currentChunkIndex < video.chunks.length - 1) {
        const nextChunk = video.chunks[currentChunkIndex + 1];
        const nextChunkWithUrl = {
          ...nextChunk,
          url: `http://localhost:8000/api/v1/production/${nextChunk.filename}`,
        };
        setCurrentChunk(nextChunkWithUrl);
        setCurrentChunkIndex(currentChunkIndex + 1);

        if (videoRef.current) {
          // Preserve playback rate when switching chunks
          const currentPlaybackRate = videoRef.current.playbackRate;
          videoRef.current.src = nextChunkWithUrl.url;
          videoRef.current.load();

          // Restore playback rate after loading
          videoRef.current.addEventListener(
            'loadeddata',
            () => {
              if (videoRef.current) {
                videoRef.current.playbackRate = currentPlaybackRate;
              }
            },
            { once: true }
          );
        }
      }
    };

    // Video event handlers
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        if (currentChunk) {
          setDuration(currentChunk.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (!isSeeking && currentChunk) {
          const localTime = video.currentTime;
          const globalTime = currentChunk.startTime + localTime;

          // Always update currentTime for chunk transitions
          setCurrentTime(globalTime);

          // Only update displayTime when not hovering and not recently seeking
          // This prevents overriding the cursor position after a timeline click
          if (!showPreview && hoverTime === null && !justSeeked) {
            setDisplayTime(globalTime);
            onTimeUpdate?.(globalTime);
          }

          // Always check for chunk transitions regardless of hover state
          if (localTime >= currentChunk.duration - 0.5) {
            handleChunkTransition();
          }
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleSeeked = () => {
        if (currentChunk) {
          const localTime = video.currentTime;
          const globalTime = currentChunk.startTime + localTime;

          console.log('handleSeeked called:', {
            actualLocalTime: localTime.toFixed(1),
            chunkStartTime: currentChunk.startTime.toFixed(1),
            calculatedGlobalTime: globalTime.toFixed(1),
            chunkIndex: currentChunk.chunkIndex,
            currentDisplayTime: displayTime.toFixed(1),
          });

          // Only update currentTime for internal tracking, don't override displayTime
          setCurrentTime(globalTime);
          // Keep displayTime as set by the timeline click - don't override it

          // Add a small delay before allowing time updates to prevent immediate override
          setTimeout(() => {
            setIsSeeking(false);
            setJustSeeked(false); // Clear the justSeeked flag
          }, 100);
        }
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
    }, [currentChunk, isSeeking, onTimeUpdate]);

    // Timeline hover handlers
    const handleTimelineMouseMove = (e: React.MouseEvent) => {
      if (!progressBarRef.current || !duration) return;

      // Clear any pending hide timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const hoverTime = percentage * (video.totalDuration || duration);

      setHoverTime(hoverTime);
      setPreviewPosition(percentage * 100);
      setShowPreview(true);

      // Throttle frame preview generation to prevent excessive seeking
      if (framePreviewTimeoutRef.current) {
        clearTimeout(framePreviewTimeoutRef.current);
      }

      framePreviewTimeoutRef.current = setTimeout(() => {
        generateFramePreview(hoverTime);
      }, 100); // 100ms delay to reduce seeking frequency
    };

    const handleTimelineMouseLeave = () => {
      // Clear any existing timeouts
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (framePreviewTimeoutRef.current) {
        clearTimeout(framePreviewTimeoutRef.current);
      }

      // Set a small delay before hiding to prevent flickering
      hoverTimeoutRef.current = setTimeout(() => {
        setHoverTime(null);
        setShowPreview(false);
        setFramePreview(null);
        // Restore displayTime to currentTime when leaving hover
        setDisplayTime(currentTime);
      }, 50);
    };

    // Generate frame preview for a specific time using a separate video element
    const generateFramePreview = async (time: number) => {
      if (!videoRef.current || !video.chunks) {
        setFramePreview(null);
        return;
      }

      try {
        // Find the chunk that contains this time
        const chunkInfo = findChunkForTime(time);
        if (!chunkInfo) {
          setFramePreview(null);
          return;
        }

        const { chunk, localTime } = chunkInfo;

        const mainVideo = videoRef.current;

        // Create a separate video element for frame preview (doesn't interfere with main playback)
        const previewVideo = document.createElement('video');
        previewVideo.crossOrigin = 'anonymous';
        previewVideo.muted = true;
        previewVideo.preload = 'metadata';

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setFramePreview(null);
          return;
        }

        // Set canvas dimensions to match main video
        canvas.width = mainVideo.videoWidth || 320;
        canvas.height = mainVideo.videoHeight || 240;

        // Load the chunk for preview
        const chunkWithUrl = {
          ...chunk,
          url: `http://localhost:8000/api/v1/production/${chunk.filename}`,
        };

        previewVideo.src = chunkWithUrl.url;

        // Wait for the preview video to load
        await new Promise((resolve, reject) => {
          const handleLoadedData = () => {
            previewVideo.removeEventListener('loadeddata', handleLoadedData);
            previewVideo.removeEventListener('error', handleError);
            resolve(void 0);
          };
          const handleError = () => {
            previewVideo.removeEventListener('loadeddata', handleLoadedData);
            previewVideo.removeEventListener('error', handleError);
            reject(new Error('Failed to load preview video'));
          };
          previewVideo.addEventListener('loadeddata', handleLoadedData);
          previewVideo.addEventListener('error', handleError);
        });

        // Ensure we have a valid localTime within the chunk duration
        const clampedLocalTime = Math.max(
          0,
          Math.min(localTime, chunk.duration)
        );

        // Seek to the local time within the chunk
        previewVideo.currentTime = clampedLocalTime;

        // Wait for seek to complete
        await new Promise((resolve, reject) => {
          const handleSeeked = () => {
            previewVideo.removeEventListener('seeked', handleSeeked);
            previewVideo.removeEventListener('error', handleError);
            resolve(void 0);
          };
          const handleError = () => {
            previewVideo.removeEventListener('seeked', handleSeeked);
            previewVideo.removeEventListener('error', handleError);
            reject(new Error('Failed to seek preview video'));
          };
          previewVideo.addEventListener('seeked', handleSeeked);
          previewVideo.addEventListener('error', handleError);
        });

        // Wait a bit more to ensure the frame is ready
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Draw the frame from the preview video
        ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        setFramePreview(dataURL);

        // Clean up the preview video element
        previewVideo.src = '';
        previewVideo.load();
      } catch (error) {
        console.warn('Failed to generate frame preview:', error);
        setFramePreview(null);
      }
    };

    // Timeline click handler
    const handleSeek = (e: React.MouseEvent) => {
      if (!progressBarRef.current || !duration) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));

      // Calculate time based on the actual click position
      const newTime = percentage * (video.totalDuration || duration);

      console.log('Timeline click:', {
        clickPercentage: (percentage * 100).toFixed(1) + '%',
        calculatedNewTime: newTime.toFixed(1),
        totalDuration: (video.totalDuration || duration).toFixed(1),
        currentDisplayTime: displayTime.toFixed(1),
      });

      setIsSeeking(true);
      setJustSeeked(true); // Mark that we just performed a seek
      setCurrentTime(newTime);
      setDisplayTime(newTime);
      handleSeekToTime(newTime);

      // Handle annotation selection based on timeline click
      if (annotations.length > 0) {
        // Calculate which interval was clicked (0-based index)
        const clickedIntervalIndex = Math.floor(
          percentage * annotations.length
        );
        const clampedIndex = Math.max(
          0,
          Math.min(clickedIntervalIndex, annotations.length - 1)
        );
        const selectedAnnotation = annotations[clampedIndex];

        if (selectedAnnotation) {
          onAnnotationClick?.(selectedAnnotation);
        }
      } else {
        onClearAnnotationSelection?.();
      }
    };

    const togglePlay = () => {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
    };

    const handlePlaybackRateChange = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const newRate = parseFloat(e.target.value);
      setPlaybackRate(newRate);
      if (videoRef.current) {
        videoRef.current.playbackRate = newRate;
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className='w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl'>
        {/* Video Element */}
        <div className='relative'>
          {currentChunk?.url ? (
            <video
              ref={videoRef}
              className='w-full h-auto'
              src={currentChunk.url}
              preload='auto'
              crossOrigin='anonymous'
            />
          ) : (
            <div className='w-full h-64 bg-gray-800 flex items-center justify-center text-white'>
              Loading video...
            </div>
          )}

          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <button
                onClick={togglePlay}
                className='bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-all'
              >
                ▶️
              </button>
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
              {/* Playback Progress */}
              <div
                className='absolute top-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded shadow-md transition-all duration-100'
                style={{
                  width: `${Math.max(0.5, Math.min(100, (currentTime / (video.totalDuration || duration)) * 100))}%`,
                }}
              />

              {/* Current Time Cursor - Always show */}
              <div
                className='absolute top-0 w-2 h-full bg-white border-2 border-blue-500 rounded shadow-lg shadow-blue-500/50 z-10'
                style={{
                  left: `${Math.min(100, (displayTime / (video.totalDuration || duration)) * 100)}%`,
                  transform: 'translateX(-50%)',
                }}
              />

              {/* Hover Cursor - Show when hovering, positioned at mouse */}
              {showPreview && hoverTime !== null && (
                <div
                  className='absolute top-0 w-2 h-full bg-yellow-400 border-2 border-yellow-600 rounded shadow-lg shadow-yellow-400/50 z-15'
                  style={{
                    left: `${previewPosition}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              )}

              {/* Selected Annotation Intervals */}
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

              {/* Frame Preview */}
              {showPreview && (
                <div
                  className='absolute bg-black bg-opacity-90 text-white p-2 rounded-lg shadow-lg z-20'
                  style={{
                    left: `${Math.max(5, Math.min(95, previewPosition))}%`,
                    transform: 'translateX(-50%)',
                    bottom: '30px',
                  }}
                >
                  {framePreview ? (
                    <img
                      src={framePreview}
                      alt='Frame Preview'
                      className='w-24 h-14 object-cover rounded'
                    />
                  ) : (
                    <div className='w-24 h-14 bg-gray-700 rounded flex items-center justify-center text-xs'>
                      <div className='text-center'>
                        <div>Time: {formatTime(hoverTime || 0)}</div>
                        <div>
                          Chunk:{' '}
                          {(() => {
                            if (!video.chunks || !hoverTime)
                              return currentChunkIndex + 1;
                            const hoverChunk = video.chunks.find(
                              (chunk) =>
                                hoverTime >= chunk.startTime &&
                                hoverTime <= chunk.endTime
                            );
                            return hoverChunk
                              ? hoverChunk.chunkIndex + 1
                              : currentChunkIndex + 1;
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={togglePlay}
                className='text-white hover:text-blue-400'
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <span className='text-white text-sm'>
                {formatTime(currentTime)} /{' '}
                {formatTime(video.totalDuration || duration)}
              </span>

              <span className='text-white text-sm'>
                Chunk{' '}
                {currentChunk?.chunkIndex !== undefined
                  ? currentChunk.chunkIndex + 1
                  : currentChunkIndex + 1}
                /{video.chunks?.length || 0}
                {currentChunk && (
                  <span className='text-gray-400 ml-2'>
                    ({formatTime(currentChunk.startTime)}-
                    {formatTime(currentChunk.endTime)})
                  </span>
                )}
              </span>

              {/* Volume Control */}
              <div className='flex items-center space-x-2'>
                <span className='text-white text-sm'>🔊</span>
                <input
                  type='range'
                  min='0'
                  max='1'
                  step='0.1'
                  value={volume}
                  onChange={handleVolumeChange}
                  className='w-20'
                />
              </div>

              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                className='bg-gray-700 text-white px-2 py-1 rounded text-sm'
              >
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
              </select>
            </div>

            {/* Annotation Selection Indicator */}
            {selectedAnnotationId &&
              annotations.length > 0 &&
              (() => {
                const selectedAnnotationIndex = annotations.findIndex(
                  (ann: any) => ann.id === selectedAnnotationId
                );
                const selectedAnnotation = annotations[selectedAnnotationIndex];
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
        </div>
      </div>
    );
  }
);

ProductionVideoPlayer.displayName = 'ProductionVideoPlayer';

export default ProductionVideoPlayer;
