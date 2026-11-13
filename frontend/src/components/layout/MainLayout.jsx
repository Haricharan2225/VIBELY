import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Library,
  Heart,
  Radio,
  Settings,
  PlusSquare,
} from 'lucide-react';
import Navbar from '../common/Navbar';
import BottomNav from '../common/BottomNav';
import MiniPlayer from '../player/MiniPlayer';
import ExpandedPlayer from '../player/ExpandedPlayer';
import { useTheme } from '../../context/ThemeContext';

export const MainLayout = () => {
  const { isTogether } = useTheme();

  const navLinks = [
    { label: 'Home', icon: Home, to: '/home' },
    { label: 'Explore', icon: Compass, to: '/explore' },
    { label: 'Search', icon: Search, to: '/search' },
    { label: 'Library', icon: Library, to: '/library' },
    { label: 'Liked Songs', icon: Heart, to: '/liked' },
    { label: 'Together Mode', icon: Radio, to: '/together', badge: 'Live' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0C] text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[#1A1A1D] p-4 gap-6 select-none">
          {/* Main Navigation */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3 mb-1">
              Menu
            </p>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1A1A1D] text-[#C6F432]'
                        : 'text-neutral-400 hover:text-white hover:bg-[#141416]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Playlists section */}
          <div className="flex-1 flex flex-col min-h-0 pt-4 border-t border-[#1A1A1D]">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Quick Picks
              </span>
              <NavLink
                to="/library"
                className="text-neutral-400 hover:text-white text-xs"
                title="Create playlist"
              >
                <PlusSquare size={16} />
              </NavLink>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto text-xs text-neutral-400 font-medium pr-1">
              <NavLink
                to="/genre/telugu"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#141416] truncate"
              >
                Telugu Top Hits
              </NavLink>
              <NavLink
                to="/genre/hindi"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#141416] truncate"
              >
                Bollywood Romance
              </NavLink>
              <NavLink
                to="/genre/melody"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#141416] truncate"
              >
                Late Night Melodies
              </NavLink>
              <NavLink
                to="/genre/hip-hop"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#141416] truncate"
              >
                Hype & Workout
              </NavLink>
            </div>
          </div>
        </aside>

        {/* Content Outlet with bottom padding for players */}
        <main className="flex-1 min-w-0 px-4 md:px-8 py-6 pb-36 md:pb-32 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mini Player */}
      <MiniPlayer />

      {/* Fullscreen Player Modal */}
      <ExpandedPlayer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;
