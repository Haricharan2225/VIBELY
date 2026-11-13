import React from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const VolumeControl = ({ className = '' }) => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayer();

  const currentVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (currentVolume === 0 || isMuted) {
      return <VolumeX size={18} className="text-neutral-400" />;
    }
    if (currentVolume < 0.3) {
      return <Volume size={18} className="text-neutral-300" />;
    }
    if (currentVolume < 0.7) {
      return <Volume1 size={18} className="text-neutral-300" />;
    }
    return <Volume2 size={18} className="text-[#C6F432]" />;
  };

  const handleSliderChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <button
        onClick={toggleMute}
        className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>

      <div className="relative w-20 sm:w-24 flex items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentVolume}
          onChange={handleSliderChange}
          className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#C6F432]"
        />
      </div>
    </div>
  );
};

export default VolumeControl;
