'use client';

import React, { useRef, useState, useEffect } from 'react';

interface SimpleSeekingPlayerProps {
  video: {
    id: string;
    title: string;
    duration: number;
    url: string;
  };
}

export default function SimpleSeekingPlayer({
  video,
}: SimpleSeekingPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      console.log('Video loaded - Duration:', video.duration);
    };

    const handleTimeUpdate = () => {
      if (!isSeeking && video.currentTime !== currentTime) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleSeeked = () => {
      console.log('Video seeked to:', video.currentTime);
      setCurrentTime(video.currentTime);
      setIsSeeking(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isSeeking]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    console.log('Seek clicked:', {
      clickX,
      percentage,
      newTime,
      duration,
      videoCurrentTime: videoRef.current.currentTime,
      videoDuration: videoRef.current.duration,
      videoReadyState: videoRef.current.readyState,
    });

    setIsSeeking(true);
    setCurrentTime(newTime);

    // Set the video time
    videoRef.current.currentTime = newTime;

    // Force update after a short delay to ensure the seek has taken effect
    setTimeout(() => {
      const actualTime = videoRef.current?.currentTime || 0;
      console.log('Seek completed - Expected:', newTime, 'Actual:', actualTime);

      if (Math.abs(actualTime - newTime) > 1) {
        console.warn('Seek failed, trying again...');
        // Try seeking again
        if (videoRef.current) {
          videoRef.current.currentTime = newTime;
          setTimeout(() => {
            setCurrentTime(videoRef.current?.currentTime || 0);
            setIsSeeking(false);
          }, 100);
        }
      } else {
        setCurrentTime(actualTime);
        setIsSeeking(false);
      }
    }, 50);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden'>
      {/* Video Element */}
      <div className='relative'>
        <video
          ref={videoRef}
          className='w-full h-auto'
          src={`http://localhost:8000/videos/${video.filename}`}
          preload='metadata'
          crossOrigin='anonymous'
        />

        {/* Play/Pause Overlay */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <button
            onClick={togglePlay}
            className='bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70 transition-all'
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className='bg-gray-900 p-4'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={togglePlay}
            className='text-white hover:text-gray-300'
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          <div className='flex-1'>
            <div className='text-white text-sm mb-2'>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Progress Bar */}
            <div
              className='w-full h-2 bg-gray-600 rounded cursor-pointer hover:h-3 transition-all'
              onClick={handleSeek}
            >
              <div
                className='h-full bg-blue-500 rounded transition-all'
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />

              {/* Current Time Cursor */}
              <div
                className='absolute top-0 w-1 h-full bg-white border border-blue-500 rounded shadow-lg z-10'
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
