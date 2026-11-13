import React from 'react';
import { Clock } from 'lucide-react';
import SongCard from '../common/SongCard';

export const TrackList = ({ songs = [], onLike, showHeader = true }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-neutral-500">
        No tracks available in this list.
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      {showHeader && (
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 px-3 pb-2 border-b border-[#1A1A1D]">
          <span>Track</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> Duration
          </span>
        </div>
      )}

      <div className="space-y-1">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} layout="row" onLike={onLike} />
        ))}
      </div>
    </div>
  );
};

export default TrackList;
