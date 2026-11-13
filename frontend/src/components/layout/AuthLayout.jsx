import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../utils/brand';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C6F432]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex flex-col items-center mb-6 text-center">
        <Link to="/" className="group mb-2 block transition-transform hover:scale-105 active:scale-95 duration-200">
          <img
            src={BRAND.logos.primary}
            alt={BRAND.name}
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_4px_20px_rgba(198,244,50,0.2)]"
          />
        </Link>
        {title && (
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-sm font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Glassmorphic Card Container */}
      <div className="relative z-10 w-full max-w-md bg-[#131316] border border-[#26262B] rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        {children}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center text-xs text-neutral-500 space-y-1">
        <p>By continuing, you agree to VIBELY's Terms of Service & Privacy Policy.</p>
        <p className="font-medium text-neutral-600">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
