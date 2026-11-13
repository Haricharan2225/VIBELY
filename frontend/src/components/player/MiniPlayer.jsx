import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Maximize2,
  ListMusic,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import QueueView from './QueueView';

export const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    next,
    previous,
    progress,
    duration,
    seek,
    setIsExpanded,
  } = usePlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [showQueuePopover, setShowQueuePopover] = useState(false);

  if (!currentSong) return null;

  return (
    <>
      {/* Popover Queue View if toggled */}
      {showQueuePopover && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 h-96 shadow-2xl">
          <QueueView onClose={() => setShowQueuePopover(false)} />
        </div>
      )}

      {/* Mini Player Fixed Container */}
      {/* On mobile, placed above the bottom navigation bar (bottom-16), on desktop bottom-0 */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-40 bg-[#121214]/95 backdrop-blur-xl border-t border-[#222226] px-3 sm:px-6 py-2.5 transition-all">
        {/* Top Slim Progress Bar for mobile */}
        <div className="md:hidden absolute top-0 left-0 right-0">
          <ProgressBar
            progress={progress}
            duration={duration}
            onSeek={seek}
            showTimes={false}
            height="h-0.5"
            hoverHeight="h-1"
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Song Info */}
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 min-w-0 max-w-[45%] md:max-w-xs cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-800 shadow-md">
              <img
                src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#C6F432] transition-colors">
                {currentSong.title}
              </h4>
              <p className="text-xs text-neutral-400 truncate">
                {currentSong.artist}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked((prev) => !prev);
              }}
              className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors shrink-0 ${
                isLiked ? 'text-rose-500 fill-current' : 'text-neutral-400 hover:text-white'
              }`}
              title="Like"
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Center: Controls + Scrubber (Desktop) */}
          <div className="hidden md:flex flex-col items-center flex-1 max-w-xl px-4">
            <div className="flex items-center gap-5 mb-1">
              <button
                onClick={previous}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Previous"
              >
                <SkipBack size={18} className="fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#C6F432] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#C6F432]/25 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={16} className="fill-current" />
                ) : (
                  <Play size={16} className="fill-current translate-x-0.5" />
                )}
              </button>
              <button
                onClick={next}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Next"
              >
                <SkipForward size={18} className="fill-current" />
              </button>
            </div>

            <ProgressBar
              progress={progress}
              duration={duration}
              onSeek={seek}
              showTimes={true}
            />
          </div>

          {/* Right: Volume & Fullscreen / Mobile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Play/Pause & Next */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#C6F432] text-black flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause size={18} className="fill-current" />
                ) : (
                  <Play size={18} className="fill-current translate-x-0.5" />
                )}
              </button>
              <button
                onClick={next}
                className="p-1.5 text-neutral-300 hover:text-white"
              >
                <SkipForward size={20} className="fill-current" />
              </button>
            </div>

            {/* Desktop Queue & Volume */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowQueuePopover((prev) => !prev)}
                className={`p-2 rounded-xl transition-colors ${
                  showQueuePopover
                    ? 'text-[#C6F432] bg-[#1A1A1D]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title="Queue"
              >
                <ListMusic size={18} />
              </button>

              <VolumeControl />

              <button
                onClick={() => setIsExpanded(true)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Expand Player"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniPlayer;
