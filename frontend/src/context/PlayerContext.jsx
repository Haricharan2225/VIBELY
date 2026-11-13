import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext(null);

// Default sample track for demonstration if no song is queued
const DEMO_SONGS = [
  {
    id: 'demo-1',
    title: 'Sammohanuda',
    artist: 'Shreya Ghoshal',
    album: 'Rules Ranjann',
    genre: 'Telugu',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'demo-2',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Hindi',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'demo-3',
    title: 'Hukum',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    genre: 'Tamil',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(DEMO_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueueState] = useState(DEMO_SONGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(DEMO_SONGS[0].duration || 0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false); // false | 'all' | 'one'
  const [isExpanded, setIsExpanded] = useState(false);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null); // remaining seconds

  const audioRef = useRef(new Audio());
  const sleepTimerRef = useRef(null);

  // Sleep timer countdown effect
  useEffect(() => {
    if (sleepTimerRemaining === null) return;

    if (sleepTimerRemaining <= 0) {
      audioRef.current.pause();
      setIsPlaying(false);
      setSleepTimerRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      setSleepTimerRemaining((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerRemaining]);

  const setSleepTimer = (minutes) => {
    if (!minutes || minutes <= 0) {
      cancelSleepTimer();
      return;
    }
    setSleepTimerRemaining(minutes * 60);
  };

  const cancelSleepTimer = () => {
    setSleepTimerRemaining(null);
  };

  // Initialize and attach audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSong?.duration || 0);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch((e) => console.warn('Replay failed:', e));
      } else {
        handleNext();
      }
    };

    const handleError = (e) => {
      console.warn('Audio playback error (using simulated progress):', e);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [repeat]);

  // Load and play when currentSong changes
  useEffect(() => {
    if (!currentSong) return;

    const audio = audioRef.current;
    const songUrl = currentSong.audioUrl || currentSong.url;

    if (songUrl && audio.src !== songUrl) {
      audio.src = songUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn('Playback autoplay prevented or error:', err);
        });
      }
    }
  }, [currentSong]);

  // Play a specific song
  const play = (song) => {
    if (!song) return;
    
    // Check if it's already in queue
    const indexInQueue = queue.findIndex((s) => s.id === song.id);
    if (indexInQueue === -1) {
      setQueueState((prev) => [song, ...prev]);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(indexInQueue);
    }

    setCurrentSong(song);
    setIsPlaying(true);

    const audio = audioRef.current;
    const url = song.audioUrl || song.url;
    if (url && audio.src !== url) {
      audio.src = url;
      audio.load();
    }
    audio.play().catch((e) => console.warn('Play interrupted:', e));
  };

  // Pause playback
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // Resume playback
  const resume = () => {
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((e) => {
      console.warn('Resume failed:', e);
      setIsPlaying(false);
    });
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  // Next song
  const handleNext = () => {
    if (queue.length === 0) return;

    let nextIdx = currentIndex + 1;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeat === 'all' || repeat === true) {
        nextIdx = 0;
      } else {
        pause();
        return;
      }
    }

    setCurrentIndex(nextIdx);
    setCurrentSong(queue[nextIdx]);
    setIsPlaying(true);
    const audio = audioRef.current;
    const url = queue[nextIdx]?.audioUrl || queue[nextIdx]?.url;
    if (url) {
      audio.src = url;
      audio.load();
      audio.play().catch((e) => console.warn('Next song play error:', e));
    }
  };

  // Previous song
  const handlePrevious = () => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }

    setCurrentIndex(prevIdx);
    setCurrentSong(queue[prevIdx]);
    setIsPlaying(true);
    const audio = audioRef.current;
    const url = queue[prevIdx]?.audioUrl || queue[prevIdx]?.url;
    if (url) {
      audio.src = url;
      audio.load();
      audio.play().catch((e) => console.warn('Previous song play error:', e));
    }
  };

  // Seek to time in seconds
  const seek = (timeInSeconds) => {
    const validTime = Math.max(0, Math.min(timeInSeconds, duration));
    audioRef.current.currentTime = validTime;
    setProgress(validTime);
  };

  // Set volume (0.0 to 1.0)
  const setVolume = (val) => {
    const newVol = Math.max(0, Math.min(val, 1));
    setVolumeState(newVol);
    audioRef.current.volume = newVol;
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setShuffle((prev) => !prev);
  };

  // Toggle repeat ('off' -> 'all' -> 'one')
  const toggleRepeat = () => {
    setRepeat((prev) => {
      if (!prev) return 'all';
      if (prev === 'all' || prev === true) return 'one';
      return false;
    });
  };

  // Add song to queue
  const addToQueue = (song) => {
    setQueueState((prev) => [...prev, song]);
  };

  // Remove song from queue by index
  const removeFromQueue = (index) => {
    setQueueState((prev) => prev.filter((_, i) => i !== index));
    if (index === currentIndex && queue.length > 1) {
      handleNext();
    }
  };

  // Clear queue
  const clearQueue = () => {
    setQueueState(currentSong ? [currentSong] : []);
    setCurrentIndex(0);
  };

  // Set new queue and play index
  const setQueue = (newQueue, startIndex = 0) => {
    if (!newQueue || newQueue.length === 0) return;
    setQueueState(newQueue);
    setCurrentIndex(startIndex);
    play(newQueue[startIndex]);
  };

  const value = {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    volume,
    isMuted,
    progress,
    duration,
    shuffle,
    repeat,
    isExpanded,
    setIsExpanded,
    sleepTimerRemaining,
    setSleepTimer,
    cancelSleepTimer,
    play,
    pause,
    resume,
    togglePlay,
    next: handleNext,
    previous: handlePrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setQueue,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;
