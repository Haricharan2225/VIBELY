import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GENRE_COLORS } from '../../utils/brand';
import { Music2 } from 'lucide-react';

export const GenreCard = ({ genre, variant = 'card' }) => {
  const navigate = useNavigate();
  const gradientClass = GENRE_COLORS[genre] || 'from-neutral-800 to-zinc-950';

  const handleClick = () => {
    navigate(`/genre/${encodeURIComponent(genre.toLowerCase())}`);
  };

  if (variant === 'pill') {
    return (
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-full text-xs font-semibold bg-[#1A1A1D] hover:bg-[#2A2A2D] text-white hover:text-[#C6F432] border border-[#333336] transition-all whitespace-nowrap cursor-pointer shadow-sm"
      >
        {genre}
      </button>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`relative h-28 md:h-32 rounded-2xl overflow-hidden p-4 cursor-pointer bg-gradient-to-br ${gradientClass} transition-transform duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group border border-white/5`}
    >
      <span className="text-white font-bold text-base md:text-lg tracking-wide drop-shadow-md">
        {genre}
      </span>

      <div className="self-end opacity-40 group-hover:opacity-80 transition-opacity">
        <Music2 size={36} className="text-white transform group-hover:rotate-12 transition-transform" />
      </div>
    </div>
  );
};

export default GenreCard;
