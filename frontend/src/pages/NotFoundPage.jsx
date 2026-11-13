import React from 'react';
import { Link } from 'react-router-dom';
import { Disc3, Home, Compass } from 'lucide-react';
import { BRAND } from '../utils/brand';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 bg-[#C6F432]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md flex flex-col items-center">
        {/* Animated broken vinyl record */}
        <div className="relative mb-6">
          <Disc3 size={90} className="text-[#C6F432] animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <h1 className="text-7xl font-black text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-white mt-2">Vibe Lost in Transition</h2>
        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
          The track or page you are looking for has been moved, unlisted, or doesn't exist on {BRAND.name}.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <Link
            to="/home"
            className="px-6 py-3 rounded-full bg-[#C6F432] text-black font-bold text-xs hover:bg-[#b5e028] transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/20"
          >
            <Home size={16} /> Back to Home
          </Link>

          <Link
            to="/explore"
            className="px-6 py-3 rounded-full bg-[#1A1A1D] hover:bg-[#2A2A2D] text-white font-semibold text-xs border border-[#333336] transition-all flex items-center gap-2"
          >
            <Compass size={16} /> Explore Music
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
