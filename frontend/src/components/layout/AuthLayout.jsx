import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../utils/brand';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C6F432]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex flex-col items-center mb-8 text-center">
        <Link to="/" className="group mb-3">
          <img
            src={BRAND.logos.transparent}
            alt={BRAND.name}
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
        {title && (
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            {subtitle}
          </p>
        )}
      </div>

      {/* Card Content */}
      <div className="relative z-10 w-full max-w-md bg-[#141416]/90 border border-[#222226] backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
        {children}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center text-xs text-neutral-500">
        <p>By continuing, you agree to VIBELY's Terms of Service & Privacy Policy.</p>
        <p className="mt-2 font-medium text-neutral-600">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
