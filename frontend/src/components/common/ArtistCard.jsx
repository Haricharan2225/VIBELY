import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  if (!artist) return null;

  return (
    <div
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="group flex flex-col items-center p-3 rounded-2xl hover:bg-[#1A1A1D] transition-all cursor-pointer text-center"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 bg-neutral-800 shadow-xl border-2 border-transparent group-hover:border-[#C6F432]/60 transition-all">
        <img
          src={artist.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#C6F432] text-black flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Play size={18} className="fill-current translate-x-0.5" />
          </div>
        </div>
      </div>

      <h4 className="font-semibold text-sm text-white truncate w-full group-hover:text-[#C6F432] transition-colors">
        {artist.name}
      </h4>
      <span className="text-xs text-neutral-400 mt-0.5">Artist</span>
    </div>
  );
};

export default ArtistCard;
