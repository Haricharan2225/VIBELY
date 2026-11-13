import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const PlayerControls = ({ size = 'md', className = '' }) => {
  const {
    isPlaying,
    togglePlay,
    next,
    previous,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const playBtnSize = size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const iconSize = size === 'lg' ? 24 : 18;
  const secondaryIconSize = size === 'lg' ? 20 : 16;

  return (
    <div className={`flex items-center justify-center gap-4 sm:gap-6 ${className}`}>
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className={`p-2 rounded-full transition-colors cursor-pointer ${
          shuffle
            ? 'text-[#C6F432] hover:text-[#b5e028]'
            : 'text-neutral-400 hover:text-white'
        }`}
        title={`Shuffle: ${shuffle ? 'On' : 'Off'}`}
      >
        <Shuffle size={secondaryIconSize} />
      </button>

      {/* Previous Button */}
      <button
        onClick={previous}
        className="p-2 rounded-full text-neutral-300 hover:text-white transition-colors cursor-pointer"
        title="Previous"
      >
        <SkipBack size={iconSize} className="fill-current" />
      </button>

      {/* Main Play / Pause Button */}
      <button
        onClick={togglePlay}
        className={`${playBtnSize} rounded-full bg-[#C6F432] text-black hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg shadow-[#C6F432]/25 cursor-pointer`}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause size={iconSize} className="fill-current" />
        ) : (
          <Play size={iconSize} className="fill-current translate-x-0.5" />
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={next}
        className="p-2 rounded-full text-neutral-300 hover:text-white transition-colors cursor-pointer"
        title="Next"
      >
        <SkipForward size={iconSize} className="fill-current" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className={`p-2 rounded-full transition-colors cursor-pointer ${
          repeat
            ? 'text-[#C6F432] hover:text-[#b5e028]'
            : 'text-neutral-400 hover:text-white'
        }`}
        title={`Repeat: ${repeat === 'one' ? 'Repeat One' : repeat === 'all' ? 'Repeat All' : 'Off'}`}
      >
        {repeat === 'one' ? (
          <Repeat1 size={secondaryIconSize} />
        ) : (
          <Repeat size={secondaryIconSize} />
        )}
      </button>
    </div>
  );
};

export default PlayerControls;
