import React from 'react';
import { BRAND } from '../../utils/brand';

export const AuthLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0B0C] text-white">
      {/* Background glow effects */}
      <div className="absolute w-72 h-72 rounded-full bg-[#C6F432]/10 blur-[100px] pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#C6F432]/20 blur-xl animate-pulse" />
          <img
            src={BRAND.logos.primary}
            alt={BRAND.name}
            className="w-24 h-24 object-contain rounded-2xl relative z-10 drop-shadow-[0_0_25px_rgba(198,244,50,0.4)] animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-white via-neutral-200 to-[#C6F432] bg-clip-text text-transparent">
          {BRAND.name}
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#C6F432] mt-1 font-semibold">
          {BRAND.tagline}
        </p>

        {/* Dynamic Equalizer / Loading Bar */}
        <div className="flex items-center gap-1.5 mt-8 h-8">
          <span className="w-1.5 bg-[#C6F432] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4" />
          <span className="w-1.5 bg-[#C6F432] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-7" />
          <span className="w-1.5 bg-[#C6F432] rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-5" />
          <span className="w-1.5 bg-[#C6F432] rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-8" />
          <span className="w-1.5 bg-[#C6F432] rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
