import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../utils/brand';
import { useAuth } from '../context/AuthContext';

export const SplashPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          navigate('/home', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0C] text-white overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-[#C6F432]/15 blur-[140px] pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Center Animated Brand Elements */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-[#C6F432]/25 blur-2xl animate-pulse" />
          <img
            src={BRAND.logos.primary}
            alt={BRAND.name}
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-3xl relative z-10 drop-shadow-[0_0_30px_rgba(198,244,50,0.5)] transform hover:scale-105 transition-transform"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-[#C6F432] bg-clip-text text-transparent">
          {BRAND.name}
        </h1>
        <p className="text-sm font-semibold tracking-widest text-[#C6F432] mt-2 uppercase">
          {BRAND.tagline}
        </p>

        {/* Pulsing indicator */}
        <div className="mt-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C6F432] animate-ping" />
          <span className="text-xs font-mono text-neutral-400">Tuning frequencies...</span>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
