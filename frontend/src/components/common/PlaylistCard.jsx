import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();

  if (!playlist) return null;

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="group p-3.5 rounded-2xl bg-[#141416] hover:bg-[#1A1A1D] transition-all duration-300 cursor-pointer border border-transparent hover:border-[#333336] flex flex-col"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3 bg-neutral-900 shadow-md">
        <img
          src={playlist.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500'}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#C6F432] text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Play size={18} className="fill-current translate-x-0.5" />
        </div>
      </div>

      <h3 className="font-semibold text-sm text-white line-clamp-1 mb-1 group-hover:text-[#C6F432] transition-colors">
        {playlist.title}
      </h3>
      <p className="text-xs text-neutral-400 line-clamp-1">
        {playlist.songCount ? `${playlist.songCount} songs` : playlist.description || 'Playlist'}
      </p>
    </div>
  );
};

export default PlaylistCard;
