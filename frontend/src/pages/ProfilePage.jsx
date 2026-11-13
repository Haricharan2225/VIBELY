import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Edit3,
  Heart,
  Music,
  Headphones,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';

export const ProfilePage = () => {
  const { user, dbUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    dbUser?.displayName || user?.displayName || 'Vibely Listener'
  );
  const [bio, setBio] = useState('Music is the language of emotions.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const photoURL = dbUser?.photoURL || user?.photoURL;

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Your Profile</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your account information and playback preferences
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
          <Check size={16} /> Profile changes saved successfully!
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#222226] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with status */}
          <div className="relative shrink-0">
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#1A1A1D] shadow-2xl"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#C6F432] to-emerald-400 flex items-center justify-center text-black font-extrabold text-3xl shadow-2xl border-4 border-[#1A1A1D]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#C6F432] border-2 border-[#141416]" title="Active" />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-white">{displayName}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#C6F432]/20 text-[#C6F432] uppercase tracking-wider">
                    <ShieldCheck size={12} /> Verified Member
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="self-center sm:self-start px-4 py-2 rounded-xl bg-[#1A1A1D] hover:bg-[#2A2A2D] text-xs font-semibold text-white border border-[#333336] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Edit3 size={14} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <p className="text-xs text-neutral-300 italic">{bio}</p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 text-xs text-neutral-400">
              {user?.email && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail size={14} /> {user.email}
                </div>
              )}
              {user?.phoneNumber && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Phone size={14} /> {user.phoneNumber}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-8 pt-6 border-t border-[#222226] space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#1A1A1D] border border-[#333336] focus:border-[#C6F432] text-white text-xs rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Bio / Status
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#1A1A1D] border border-[#333336] focus:border-[#C6F432] text-white text-xs rounded-xl p-3 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C6F432] text-black font-bold text-xs hover:bg-[#b5e028] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-[#222226] text-center">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-2">
            <Heart size={20} className="fill-current" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">48</p>
          <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">
            Liked Songs
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-[#222226] text-center">
          <div className="w-10 h-10 rounded-xl bg-[#C6F432]/10 text-[#C6F432] flex items-center justify-center mx-auto mb-2">
            <Music size={20} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">6</p>
          <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">
            Playlists
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-[#222226] text-center">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
            <Headphones size={20} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">142h</p>
          <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider mt-1">
            Streamed
          </p>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-4 border-t border-[#1A1A1D] flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">Sign Out</p>
          <p className="text-xs text-neutral-500">End your current session on this device</p>
        </div>
        <LogoutButton variant="danger-outline" />
      </div>
    </div>
  );
};

export default ProfilePage;
