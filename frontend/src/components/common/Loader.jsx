import React from 'react';
import { BRAND } from '../../utils/brand';

export const Loader = ({ size = 'md', text = 'Loading vibes...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <div className="relative flex items-center justify-center">
        {/* Animated spin ring */}
        <div
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-2 border-white/10 border-t-[#C6F432] animate-spin`}
        />
        {/* Center Logo Icon */}
        <img
          src={BRAND.logos.icon}
          alt={BRAND.name}
          className="absolute w-1/2 h-1/2 object-contain"
        />
      </div>
      {text && (
        <span className="text-xs text-neutral-400 font-medium tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
