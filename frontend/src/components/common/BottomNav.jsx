import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Search, Library, Users } from 'lucide-react';

export const BottomNav = () => {
  const navItems = [
    { label: 'Home', icon: Home, to: '/home' },
    { label: 'Explore', icon: Compass, to: '/explore' },
    { label: 'Search', icon: Search, to: '/search' },
    { label: 'Library', icon: Library, to: '/library' },
    { label: 'Together', icon: Users, to: '/together' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B0B0C]/95 backdrop-blur-lg border-t border-[#1A1A1D] px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#C6F432]'
                    : 'text-neutral-400 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium tracking-tight">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
