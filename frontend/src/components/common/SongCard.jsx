import React from 'react';
import { Play, Pause, Heart, MoreVertical } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const SongCard = ({
  song,
  layout = 'card', // 'card' | 'row'
  onLike,
  isLiked = false,
}) => {
  const { currentSong, isPlaying, play, pause } = usePlayer();

  if (!song) return null;

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    if (isThisPlaying) {
      pause();
    } else {
      play(song);
    }
  };

  if (layout === 'row') {
    return (
      <div
        onClick={handlePlayToggle}
        className={`group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A1A1D] transition-colors cursor-pointer border border-transparent hover:border-[#333336] ${
          isCurrent ? 'bg-[#1A1A1D]/80 border-[#C6F432]/30' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Cover Art with Play Button */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
            <img
              src={song.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'}
              alt={song.title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {isThisPlaying ? (
                <Pause size={18} className="text-[#C6F432] fill-current" />
              ) : (
                <Play size={18} className="text-[#C6F432] fill-current translate-x-0.5" />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                isCurrent ? 'text-[#C6F432]' : 'text-white'
              }`}
            >
              {song.title}
            </h4>
            <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
          </div>
        </div>

        {/* Extra info & actions */}
        <div className="flex items-center gap-3 text-neutral-400 text-xs">
          {song.genre && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#2A2A2D] text-neutral-300">
              {song.genre}
            </span>
          )}
          {song.duration && (
            <span className="hidden md:inline-block">
              {Math.floor(song.duration / 60)}:
              {(song.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onLike) onLike(song);
            }}
            className={`p-1.5 rounded-full hover:text-white transition-colors ${
              isLiked ? 'text-rose-500 fill-current' : 'text-neutral-400'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handlePlayToggle}
      className={`group relative p-3 rounded-2xl bg-[#141416] hover:bg-[#1A1A1D] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#333336] flex flex-col ${
        isCurrent ? 'ring-1 ring-[#C6F432]/50' : ''
      }`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-neutral-900 shadow-lg">
        <img
          src={song.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500'}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover play button */}
        <div
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#C6F432] text-black flex items-center justify-center shadow-xl transition-all duration-300 transform ${
            isThisPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          {isThisPlaying ? (
            <Pause size={18} className="fill-current" />
          ) : (
            <Play size={18} className="fill-current translate-x-0.5" />
          )}
        </div>
      </div>

      {/* Song Info */}
      <h3
        className={`font-semibold text-sm line-clamp-1 mb-1 ${
          isCurrent ? 'text-[#C6F432]' : 'text-white'
        }`}
      >
        {song.title}
      </h3>
      <p className="text-xs text-neutral-400 line-clamp-1">{song.artist}</p>
    </div>
  );
};

export default SongCard;
