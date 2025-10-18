'use client';

import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Keyboard,
} from 'lucide-react';
import { useVideoPlayerStore } from '@/store/videoPlayerStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Annotation } from '@/types';

interface YouTubeLikeVideoPlayerProps {
  video: {
    id: string;
    title: string;
    filename: string;
    duration: number;
    fps?: number;
  };
  annotations: Annotation[];
  onAnnotationClick?: (annotation: Annotation) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onCreateAnnotation?: (time: number) => void;
}

export interface YouTubeLikeVideoPlayerRef {
  seekTo: (time: number) => void;
  play: () => void;
  pause: () => void;
  seekFrame: (direction: 'forward' | 'backward') => void;
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4, 8];

const YouTubeLikeVideoPlayer = forwardRef<
  YouTubeLikeVideoPlayerRef,
  YouTubeLikeVideoPlayerProps
>(function YouTubeLikeVideoPlayer(
  { video, annotations, onAnnotationClick, onTimeUpdate, onCreateAnnotation },
  ref
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    showControls,
    showKeyboardHelp,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setPlaybackRate,
    setVolume,
    setIsMuted,
    setShowControls,
    setShowKeyboardHelp,
    getFormattedTime,
  } = useVideoPlayerStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPosition, setHoverPosition] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewCache, setPreviewCache] = useState<Map<number, string>>(
    new Map()
  );

  // Frame-accurate seeking
  const fps = video.fps || 30;
  const frameDuration = 1 / fps;

  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    play: () => {
      videoRef.current?.play();
    },
    pause: () => {
      videoRef.current?.pause();
    },
    seekFrame: (direction: 'forward' | 'backward') => {
      if (videoRef.current) {
        const newTime =
          direction === 'forward'
            ? Math.min(duration, currentTime + frameDuration)
            : Math.max(0, currentTime - frameDuration);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    },
  }));

  // Video event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      const time = videoElement.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [setCurrentTime, setDuration, setIsPlaying, onTimeUpdate]);

  // Generate frame preview
  const generateFramePreview = useCallback(
    async (time: number) => {
      if (previewCache.has(Math.floor(time))) {
        setPreviewImage(previewCache.get(Math.floor(time)) || null);
        return;
      }

      setIsLoadingPreview(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/videos/${video.id}/frame/${time}`
        );
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          setPreviewImage(imageUrl);
          setPreviewCache((prev) =>
            new Map(prev).set(Math.floor(time), imageUrl)
          );
        }
      } catch (error) {
        console.error('Error loading frame preview:', error);
      } finally {
        setIsLoadingPreview(false);
      }
    },
    [video.id, previewCache]
  );

  // Handle progress bar hover
  const handleProgressHover = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const time = percentage * duration;

      setHoverTime(time);
      setHoverPosition(percentage * 100);
      setIsHoveringProgress(true);

      // Generate preview for hovered time
      generateFramePreview(time);
    },
    [duration, generateFramePreview]
  );

  const handleProgressLeave = useCallback(() => {
    setIsHoveringProgress(false);
    setPreviewImage(null);
  }, []);

  // Playback functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const seekFrame = (direction: 'forward' | 'backward') => {
    if (videoRef.current) {
      const newTime =
        direction === 'forward'
          ? Math.min(duration, currentTime + frameDuration)
          : Math.max(0, currentTime - frameDuration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const changePlaybackSpeed = (delta: number) => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackRate);
    const newIndex = Math.max(
      0,
      Math.min(PLAYBACK_SPEEDS.length - 1, currentIndex + delta)
    );
    const newRate = PLAYBACK_SPEEDS[newIndex];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const setSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const goToTimestamp = () => {
    const input = prompt('Go to timestamp (HH:MM:SS or MM:SS or seconds):');
    if (!input) return;

    let seconds = 0;
    const parts = input.split(':').map(Number);

    if (parts.length === 3) {
      // HH:MM:SS
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // Seconds
      seconds = parts[0];
    }

    if (!isNaN(seconds) && seconds >= 0 && seconds <= duration) {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        setCurrentTime(seconds);
      }
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    // Playback
    { key: ' ', action: togglePlay, description: 'Play/Pause' },
    { key: 'k', action: togglePlay, description: 'Play/Pause' },
    { key: 'j', action: () => skipTime(-10), description: 'Rewind 10s' },
    { key: 'l', action: () => skipTime(10), description: 'Forward 10s' },
    {
      key: 'ArrowLeft',
      action: () => skipTime(-5),
      description: 'Seek backward 5s',
    },
    {
      key: 'ArrowRight',
      action: () => skipTime(5),
      description: 'Seek forward 5s',
    },
    {
      key: 'ArrowLeft',
      shift: true,
      action: () => skipTime(-30),
      description: 'Seek backward 30s',
    },
    {
      key: 'ArrowRight',
      shift: true,
      action: () => skipTime(30),
      description: 'Seek forward 30s',
    },
    {
      key: 'Home',
      action: () => videoRef.current && (videoRef.current.currentTime = 0),
      description: 'Jump to start',
    },
    {
      key: 'End',
      action: () =>
        videoRef.current && (videoRef.current.currentTime = duration),
      description: 'Jump to end',
    },

    // Frame control
    {
      key: ',',
      action: () => seekFrame('backward'),
      description: 'Previous frame',
    },
    { key: '.', action: () => seekFrame('forward'), description: 'Next frame' },

    // Speed control
    {
      key: '[',
      action: () => changePlaybackSpeed(-1),
      description: 'Decrease speed',
    },
    {
      key: ']',
      action: () => changePlaybackSpeed(1),
      description: 'Increase speed',
    },

    // Volume
    {
      key: 'ArrowUp',
      action: () => handleVolumeChange(Math.min(1, volume + 0.1)),
      description: 'Volume up',
    },
    {
      key: 'ArrowDown',
      action: () => handleVolumeChange(Math.max(0, volume - 0.1)),
      description: 'Volume down',
    },
    { key: 'm', action: toggleMute, description: 'Mute/Unmute' },

    // View
    { key: 'f', action: toggleFullscreen, description: 'Fullscreen' },
    { key: 'g', action: goToTimestamp, description: 'Go to timestamp' },
    {
      key: '?',
      action: () => setShowKeyboardHelp(!showKeyboardHelp),
      description: 'Show shortcuts',
    },

    // Annotations
    {
      key: 'm',
      shift: true,
      action: () => onCreateAnnotation?.(currentTime),
      description: 'Mark annotation',
    },
    {
      key: '1',
      action: () => onCreateAnnotation?.(currentTime),
      description: 'Critical incident',
    },
    {
      key: '2',
      action: () => onCreateAnnotation?.(currentTime),
      description: 'Suspicious activity',
    },
    {
      key: '3',
      action: () => onCreateAnnotation?.(currentTime),
      description: 'Policy violation',
    },
    {
      key: '4',
      action: () => onCreateAnnotation?.(currentTime),
      description: 'Note',
    },
    {
      key: '5',
      action: () => onCreateAnnotation?.(currentTime),
      description: 'Evidence marker',
    },
  ]);

  // Annotation helpers
  const getAnnotationPosition = (annotation: Annotation) => {
    return (annotation.startTime / duration) * 100;
  };

  const getAnnotationWidth = (annotation: Annotation) => {
    if (!annotation.endTime) return 0.5;
    return ((annotation.endTime - annotation.startTime) / duration) * 100;
  };

  return (
    <div
      ref={containerRef}
      className='relative bg-black rounded-lg overflow-hidden group'
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className='w-full h-full'
        src={`http://localhost:8000/videos/${video.filename}`}
        onClick={togglePlay}
      />

      {/* Playback Speed Indicator */}
      {playbackRate !== 1 && (
        <div className='absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-mono'>
          {playbackRate}x
        </div>
      )}

      {/* Frame Number */}
      <div className='absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-xs font-mono'>
        Frame: {Math.floor(currentTime * fps)}
      </div>

      {/* Progress Bar with Annotations and Preview */}
      <div className='absolute bottom-16 left-0 right-0 px-4'>
        <div
          ref={progressBarRef}
          className='relative h-2 bg-gray-700 rounded cursor-pointer hover:h-3 transition-all'
          onClick={handleSeek}
          onMouseMove={handleProgressHover}
          onMouseLeave={handleProgressLeave}
        >
          {/* Playback progress */}
          <div
            className='absolute top-0 left-0 h-full bg-blue-500 rounded'
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />

          {/* Hover preview indicator */}
          {isHoveringProgress && (
            <div
              className='absolute top-0 w-1 h-full bg-white rounded'
              style={{ left: `${hoverPosition}%` }}
            />
          )}

          {/* Annotation markers */}
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className='absolute top-0 h-full cursor-pointer hover:h-4 transition-all'
              style={{
                left: `${getAnnotationPosition(annotation)}%`,
                width: `${Math.max(0.5, getAnnotationWidth(annotation))}%`,
                backgroundColor: annotation.color,
                opacity: 0.8,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAnnotationClick?.(annotation);
              }}
              title={annotation.title}
            />
          ))}
        </div>

        {/* Frame Preview Tooltip */}
        {isHoveringProgress && (
          <div
            ref={previewRef}
            className='absolute bottom-6 transform -translate-x-1/2 pointer-events-none z-50'
            style={{ left: `${hoverPosition}%` }}
          >
            <div className='bg-black/90 rounded-lg p-2 shadow-lg'>
              {isLoadingPreview ? (
                <div className='w-32 h-18 bg-gray-700 rounded flex items-center justify-center'>
                  <div className='text-white text-xs'>Loading...</div>
                </div>
              ) : previewImage ? (
                <img
                  src={previewImage}
                  alt='Frame preview'
                  className='w-32 h-18 object-cover rounded'
                />
              ) : (
                <div className='w-32 h-18 bg-gray-700 rounded flex items-center justify-center'>
                  <div className='text-white text-xs'>No preview</div>
                </div>
              )}
              <div className='text-white text-xs text-center mt-1 font-mono'>
                {getFormattedTime(hoverTime)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='flex items-center gap-3'>
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className='text-white hover:text-blue-400 transition-colors'
            title='Play/Pause (Space)'
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Skip buttons */}
          <button
            onClick={() => skipTime(-10)}
            className='text-white hover:text-blue-400 transition-colors'
            title='Rewind 10s (J)'
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={() => skipTime(10)}
            className='text-white hover:text-blue-400 transition-colors'
            title='Forward 10s (L)'
          >
            <SkipForward size={20} />
          </button>

          {/* Frame step */}
          <button
            onClick={() => seekFrame('backward')}
            className='text-white hover:text-blue-400 transition-colors'
            title='Previous frame (,)'
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => seekFrame('forward')}
            className='text-white hover:text-blue-400 transition-colors'
            title='Next frame (.)'
          >
            <ChevronRight size={20} />
          </button>

          {/* Time display */}
          <div className='text-white text-sm font-mono'>
            {getFormattedTime(currentTime)} / {getFormattedTime(duration)}
          </div>

          {/* Playback speed */}
          <div className='relative'>
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className='text-white hover:text-blue-400 transition-colors flex items-center gap-1'
              title='Playback speed ([/])'
            >
              <Gauge size={20} />
              <span className='text-xs'>{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div className='absolute bottom-full mb-2 bg-gray-900 rounded shadow-lg py-1 min-w-[100px]'>
                {PLAYBACK_SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSpeed(speed)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-800 ${
                      speed === playbackRate ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className='flex items-center gap-2'>
            <button
              onClick={toggleMute}
              className='text-white hover:text-blue-400 transition-colors'
              title='Mute (M)'
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className='w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer'
            />
          </div>

          <div className='flex-1' />

          {/* Keyboard help */}
          <button
            onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
            className='text-white hover:text-blue-400 transition-colors'
            title='Keyboard shortcuts (?)'
          >
            <Keyboard size={20} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className='text-white hover:text-blue-400 transition-colors'
            title='Fullscreen (F)'
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* Keyboard Help Overlay */}
      {showKeyboardHelp && (
        <div className='absolute inset-0 bg-black/90 flex items-center justify-center z-50'>
          <div className='bg-gray-900 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-white text-xl font-bold'>
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className='text-white hover:text-blue-400'
              >
                ✕
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <h4 className='text-blue-400 font-semibold mb-2'>Playback</h4>
                <div className='space-y-1 text-gray-300'>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>Space</kbd>{' '}
                    Play/Pause
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>J</kbd>{' '}
                    Rewind 10s
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>L</kbd>{' '}
                    Forward 10s
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>←</kbd> Seek
                    -5s
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>→</kbd> Seek
                    +5s
                  </div>
                </div>
              </div>

              <div>
                <h4 className='text-blue-400 font-semibold mb-2'>
                  Frame Control
                </h4>
                <div className='space-y-1 text-gray-300'>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>,</kbd>{' '}
                    Previous frame
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>.</kbd> Next
                    frame
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>Home</kbd>{' '}
                    Jump to start
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>End</kbd>{' '}
                    Jump to end
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>G</kbd> Go to
                    timestamp
                  </div>
                </div>
              </div>

              <div>
                <h4 className='text-blue-400 font-semibold mb-2'>
                  Speed & Volume
                </h4>
                <div className='space-y-1 text-gray-300'>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>[</kbd>{' '}
                    Decrease speed
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>]</kbd>{' '}
                    Increase speed
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>↑</kbd>{' '}
                    Volume up
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>↓</kbd>{' '}
                    Volume down
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>M</kbd> Mute
                  </div>
                </div>
              </div>

              <div>
                <h4 className='text-blue-400 font-semibold mb-2'>
                  Annotations
                </h4>
                <div className='space-y-1 text-gray-300'>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>1</kbd>{' '}
                    Critical incident
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>2</kbd>{' '}
                    Suspicious activity
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>3</kbd>{' '}
                    Policy violation
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>4</kbd> Note
                  </div>
                  <div>
                    <kbd className='bg-gray-800 px-2 py-1 rounded'>5</kbd>{' '}
                    Evidence marker
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

YouTubeLikeVideoPlayer.displayName = 'YouTubeLikeVideoPlayer';

export default YouTubeLikeVideoPlayer;
