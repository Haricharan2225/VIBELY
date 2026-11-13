import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Heart, Radio, Search } from 'lucide-react';
import { BRAND } from '../../utils/brand';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from './SearchBar';

export const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const { isTogether } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const displayName = dbUser?.displayName || user?.displayName || user?.phoneNumber || 'Music Lover';
  const avatarUrl = dbUser?.photoURL || user?.photoURL;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0C]/90 backdrop-blur-md border-b border-[#1A1A1D] px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/home" className="flex items-center gap-3 shrink-0 group">
          <img
            src={BRAND.logos.transparent}
            alt={BRAND.name}
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Center Search Bar (Hidden on tiny screens, icon opens search) */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <SearchBar onSubmit={handleSearchSubmit} />
        </div>

        {/* Right Navigation & Profile */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Quick Search on mobile */}
          <Link
            to="/search"
            className="sm:hidden p-2 rounded-full text-neutral-400 hover:text-white hover:bg-[#1A1A1D] transition-colors"
            title="Search"
          >
            <Search size={20} />
          </Link>

          {/* Together Mode Badge/Button */}
          <Link
            to="/together"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
              isTogether || location.pathname === '/together'
                ? 'bg-[#FF6B5B] text-white shadow-lg shadow-[#FF6B5B]/30'
                : 'bg-[#1A1A1D] text-neutral-300 hover:text-[#FF6B5B] hover:border-[#FF6B5B]/40 border border-[#333336]'
            }`}
          >
            <Radio size={14} className="animate-pulse" />
            <span className="hidden md:inline">Together Mode</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-[#C6F432]/60 transition-all focus:outline-none"
              title="Account menu"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover border border-[#333336]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C6F432] to-emerald-400 flex items-center justify-center text-black font-bold text-xs shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {/* Menu Popover */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1A1A1D] border border-[#333336] shadow-2xl p-2 z-50 text-sm">
                  <div className="px-3 py-2 border-b border-[#2A2A2D] mb-1">
                    <p className="font-semibold text-white truncate">{displayName}</p>
                    <p className="text-xs text-neutral-400 truncate">
                      {user?.email || user?.phoneNumber || 'Vibely Free'}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-300 hover:text-[#C6F432] hover:bg-[#2A2A2D] transition-colors"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/liked"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-300 hover:text-rose-400 hover:bg-[#2A2A2D] transition-colors"
                  >
                    <Heart size={16} />
                    <span>Liked Songs</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#2A2A2D] transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>

                  <div className="border-t border-[#2A2A2D] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
