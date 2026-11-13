import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Library as LibraryIcon,
  Heart,
  Plus,
  Clock,
  Music2,
  FolderPlus,
  X,
} from 'lucide-react';
import PlaylistCard from '../components/common/PlaylistCard';
import SongCard from '../components/common/SongCard';

const USER_PLAYLISTS = [
  {
    id: 'my-pl-1',
    title: 'Daily Dopamine',
    description: 'Upbeat tracks to get the momentum going',
    songCount: 24,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400',
  },
  {
    id: 'my-pl-2',
    title: 'Rainy Night Acoustics',
    description: 'Warm, cozy Telugu and Hindi melodies',
    songCount: 18,
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
  },
  {
    id: 'my-pl-3',
    title: 'Workout Bass Boosters',
    description: 'Heavy bass drops & adrenaline',
    songCount: 32,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400',
  },
];

const RECENT_HISTORY = [
  {
    id: 'hist-1',
    title: 'Sammohanuda',
    artist: 'Shreya Ghoshal',
    album: 'Rules Ranjann',
    genre: 'Telugu',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'hist-2',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Hindi',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'hist-3',
    title: 'Hukum',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    genre: 'Tamil',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const LibraryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('playlists'); // 'playlists' | 'history'
  const [playlists, setPlaylists] = useState(USER_PLAYLISTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPl = {
      id: `pl-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Created by you',
      songCount: 0,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    };

    setPlaylists([newPl, ...playlists]);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C6F432] mb-1">
            <LibraryIcon size={22} />
            <span className="text-xs font-bold uppercase tracking-widest">Personal Vault</span>
          </div>
          <h1 className="text-3xl font-black text-white">Your Music Library</h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#C6F432] text-black font-bold text-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/20 cursor-pointer"
        >
          <Plus size={16} /> New Playlist
        </button>
      </div>

      {/* Liked Songs Special Banner Card */}
      <Link
        to="/liked"
        className="block p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-[#141416] border border-rose-500/20 hover:border-rose-500/50 transition-all shadow-xl group"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Heart size={32} className="fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
              Auto Playlist
            </span>
            <h2 className="text-2xl font-black text-white mt-0.5">Liked Songs</h2>
            <p className="text-xs text-neutral-300 mt-1">
              Your entire collection of favorited songs • Updated continuously
            </p>
          </div>
        </div>
      </Link>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#1A1A1D] pb-3">
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'playlists'
              ? 'bg-[#1A1A1D] text-[#C6F432] border border-[#C6F432]/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Music2 size={16} /> Playlists ({playlists.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#1A1A1D] text-[#C6F432] border border-[#C6F432]/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock size={16} /> Listening History
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'playlists' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-w-3xl">
          {RECENT_HISTORY.map((song) => (
            <SongCard key={song.id} song={song} layout="row" />
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#141416] border border-[#2A2A2D] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2D] mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <FolderPlus size={20} className="text-[#C6F432]" />
                Create New Playlist
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Playlist Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hyderabad Chill Beats"
                  className="w-full bg-[#1A1A1D] border border-[#333336] focus:border-[#C6F432] text-white text-sm rounded-xl py-2.5 px-3.5 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Give your playlist a vibe description..."
                  rows={3}
                  className="w-full bg-[#1A1A1D] border border-[#333336] focus:border-[#C6F432] text-white text-sm rounded-xl py-2.5 px-3.5 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C6F432] text-black font-bold text-xs hover:bg-[#b5e028] transition-colors"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
