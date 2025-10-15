'use client';

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import { Annotation } from '@/types';

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    filename: string;
    duration: number;
  };
  annotations: Annotation[];
  onAnnotationClick?: (annotation: Annotation) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  play: () => void;
  pause: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ video, annotations, onAnnotationClick, onTimeUpdate }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.currentTime = time;
          setCurrentTime(time);
        }
      },
      play: () => {
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.play();
        }
      },
      pause: () => {
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.pause();
        }
      },
    }));

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
      const handleError = (e: Event) => {
        console.error('Video error:', e);
        // You could show a user-friendly error message here
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('error', handleError);
      };
    }, [onTimeUpdate]);

    const togglePlay = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play().catch((error) => {
          console.error('Error playing video:', error);
          // You could show a user-friendly error message here
        });
      }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;

      videoElement.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const toggleMute = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (isMuted) {
        videoElement.muted = false;
        videoElement.volume = volume;
        setIsMuted(false);
      } else {
        videoElement.muted = true;
        setIsMuted(true);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      const videoElement = videoRef.current;
      if (!videoElement) return;

      videoElement.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    };

    const skipTime = (seconds: number) => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      videoElement.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    };

    const toggleFullscreen = () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (!document.fullscreenElement) {
        videoElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    const getAnnotationPosition = (annotation: Annotation) => {
      return (annotation.startTime / duration) * 100;
    };

    const getAnnotationWidth = (annotation: Annotation) => {
      return ((annotation.endTime - annotation.startTime) / duration) * 100;
    };

    return (
      <div
        className="video-player-container relative bg-black rounded-lg overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          src={`http://localhost:8000/videos/${video.filename}`}
          poster=""
          onClick={togglePlay}
        />

        {/* Progress Bar with Annotations */}
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <div className="progress-bar relative h-1 bg-gray-600 rounded cursor-pointer" onClick={handleSeek}>
            <div
              className="progress-fill h-full bg-blue-500 rounded transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />

            {/* Annotation Markers */}
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute top-0 h-full cursor-pointer transition-all duration-200 hover:h-2"
                style={{
                  left: `${getAnnotationPosition(annotation)}%`,
                  width: `${getAnnotationWidth(annotation)}%`,
                  backgroundColor: annotation.color,
                  opacity: 0.7,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAnnotationClick?.(annotation);
                }}
                title={annotation.title}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div
          className={`video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 ${
            showControls ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Skip Buttons */}
            <button onClick={() => skipTime(-10)} className="text-white hover:text-blue-400 transition-colors">
              <SkipBack size={20} />
            </button>
            <button onClick={() => skipTime(10)} className="text-white hover:text-blue-400 transition-colors">
              <SkipForward size={20} />
            </button>

            {/* Time Display */}
            <div className="text-white text-sm font-mono">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Fullscreen Button */}
            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors ml-auto">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
