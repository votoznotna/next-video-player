import { create } from 'zustand';

export interface VideoPlayerState {
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;

  // UI state
  showControls: boolean;
  showAnnotations: boolean;
  showKeyboardHelp: boolean;
  timelineZoom: number;

  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setShowControls: (show: boolean) => void;
  setShowAnnotations: (show: boolean) => void;
  setShowKeyboardHelp: (show: boolean) => void;
  setTimelineZoom: (zoom: number) => void;

  // Computed
  getFormattedTime: (time: number) => string;
}

export const useVideoPlayerStore = create<VideoPlayerState>((set, get) => ({
  // Initial state
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  showControls: true,
  showAnnotations: true,
  showKeyboardHelp: false,
  timelineZoom: 1,

  // Actions
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setShowControls: (showControls) => set({ showControls }),
  setShowAnnotations: (showAnnotations) => set({ showAnnotations }),
  setShowKeyboardHelp: (showKeyboardHelp) => set({ showKeyboardHelp }),
  setTimelineZoom: (timelineZoom) => set({ timelineZoom }),

  // Computed
  getFormattedTime: (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
}));
