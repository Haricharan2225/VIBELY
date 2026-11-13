import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Volume2,
  Trash2,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';
import { BRAND } from '../utils/brand';

export const SettingsPage = () => {
  const { user, dbUser } = useAuth();

  const [audioQuality, setAudioQuality] = useState('high'); // 'normal' | 'high' | 'lossless'
  const [crossfade, setCrossfade] = useState(true);
  const [normalizeVolume, setNormalizeVolume] = useState(true);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 text-[#C6F432] mb-1">
          <SettingsIcon size={22} />
          <span className="text-xs font-bold uppercase tracking-widest">Preferences</span>
        </div>
        <h1 className="text-3xl font-black text-white">App Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Customize audio streaming, sound effects, and security preferences
        </p>
      </div>

      {cacheCleared && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
          <Check size={16} /> Audio cache cleared successfully!
        </div>
      )}

      {/* Audio Playback Settings */}
      <div className="p-6 rounded-3xl bg-[#141416] border border-[#222226] space-y-6">
        <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222226]">
          <Volume2 size={18} className="text-[#C6F432]" />
          <span>Audio Quality & Streaming</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Streaming Audio Quality
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'normal', label: 'Standard', desc: '128 kbps (Saves data)' },
                { id: 'high', label: 'High', desc: '256 kbps (Balanced)' },
                { id: 'lossless', label: 'Hi-Fi Lossless', desc: '320 kbps (Studio vibe)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAudioQuality(opt.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    audioQuality === opt.id
                      ? 'bg-[#1A1A1D] border-[#C6F432] text-white shadow-md shadow-[#C6F432]/10'
                      : 'bg-[#0E0E10] border-[#222226] text-neutral-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">{opt.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Crossfade Toggle */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-white">Crossfade Songs</p>
              <p className="text-[11px] text-neutral-400">Smooth transition between consecutive tracks</p>
            </div>
            <button
              onClick={() => setCrossfade((prev) => !prev)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                crossfade ? 'bg-[#C6F432]' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-black w-4 h-4 rounded-full transition-transform ${
                  crossfade ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Volume Normalization */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-semibold text-white">Normalize Volume</p>
              <p className="text-[11px] text-neutral-400">Set the same volume level for all tracks</p>
            </div>
            <button
              onClick={() => setNormalizeVolume((prev) => !prev)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                normalizeVolume ? 'bg-[#C6F432]' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-black w-4 h-4 rounded-full transition-transform ${
                  normalizeVolume ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Storage and Cache */}
      <div className="p-6 rounded-3xl bg-[#141416] border border-[#222226] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222226]">
          <Sliders size={18} className="text-[#C6F432]" />
          <span>Storage & Offline Data</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">Clear Cached Tracks</p>
            <p className="text-[11px] text-neutral-400">Free up local browser disk space (142 MB cached)</p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl bg-[#1A1A1D] hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white border border-[#333336] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 size={14} /> Clear Cache
          </button>
        </div>
      </div>

      {/* Account Info & Sign Out */}
      <div className="p-6 rounded-3xl bg-[#141416] border border-[#222226] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base pb-3 border-b border-[#222226]">
          <Shield size={18} className="text-[#C6F432]" />
          <span>Account & Security</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white">
              {dbUser?.displayName || user?.displayName || 'Vibely User'}
            </p>
            <p className="text-[11px] text-neutral-400">
              {user?.email || user?.phoneNumber || 'Logged in session'}
            </p>
          </div>

          <LogoutButton variant="danger-outline" />
        </div>
      </div>

      {/* App Branding Info */}
      <div className="text-center text-xs text-neutral-500 pt-4">
        <p className="font-semibold text-neutral-400">{BRAND.name} App v1.0.0</p>
        <p className="mt-1">Built with React, Vite, Tailwind CSS & Firebase</p>
      </div>
    </div>
  );
};

export default SettingsPage;
