import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LogoutButton = ({ className = '', showLabel = true, variant = 'default' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  if (variant === 'danger-outline') {
    return (
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 transition-all text-sm font-semibold cursor-pointer disabled:opacity-50 ${className}`}
      >
        <LogOut size={16} />
        {showLabel && <span>{loggingOut ? 'Signing out...' : 'Log Out'}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1D] hover:bg-rose-500/15 text-neutral-300 hover:text-rose-400 border border-[#333336] transition-all text-sm font-medium cursor-pointer disabled:opacity-50 ${className}`}
    >
      <LogOut size={16} />
      {showLabel && <span>{loggingOut ? 'Signing out...' : 'Log Out'}</span>}
    </button>
  );
};

export default LogoutButton;
