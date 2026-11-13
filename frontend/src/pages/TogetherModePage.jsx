import React, { useState, useEffect } from 'react';
import {
  Users,
  Radio,
  Copy,
  Check,
  Plus,
  Play,
  Pause,
  LogOut,
  Flame,
  Heart,
  Sparkles,
  Music,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { THEME_B } from '../utils/brand';

const MOCK_PARTICIPANTS = [
  { id: 'p1', name: 'You (Host)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', isHost: true },
  { id: 'p2', name: 'Rohan Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', isHost: false },
  { id: 'p3', name: 'Ananya Roy', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', isHost: false },
];

const SHARED_QUEUE = [
  {
    id: 't-1',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    addedBy: 'Rohan',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 't-2',
    title: 'Sammohanuda',
    artist: 'Shreya Ghoshal',
    addedBy: 'You',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 't-3',
    title: 'Hukum',
    artist: 'Anirudh Ravichander',
    addedBy: 'Ananya',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const TogetherModePage = () => {
  const { setTogether } = useTheme();
  const { currentSong, isPlaying, play, pause } = usePlayer();
  const { user, dbUser } = useAuth();

  const [inRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('VIBE-772');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [sharedQueue, setSharedQueue] = useState(SHARED_QUEUE);
  const [reactions, setReactions] = useState([]);

  // Enable Together Theme on mount, restore on unmount
  useEffect(() => {
    setTogether(true);
    return () => setTogether(false);
  }, [setTogether]);

  const handleCreateRoom = () => {
    const randomCode = 'VIBE-' + Math.floor(100 + Math.random() * 900);
    setRoomCode(randomCode);
    setInRoom(true);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    setRoomCode(joinCodeInput.trim().toUpperCase());
    setInRoom(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerReaction = (emoji) => {
    const newReaction = { id: Date.now(), emoji, left: Math.random() * 80 + 10 };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Floating Reaction animations */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-20 text-4xl animate-bounce"
            style={{
              left: `${r.left}%`,
              transition: 'all 2s ease-out',
              transform: 'translateY(-300px)',
              opacity: 0.9,
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B] text-xs font-bold uppercase tracking-wider mb-2">
            <Radio size={14} className="animate-pulse" /> Together Mode
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F4EDE0]">
            Listen in Real-Time Sync
          </h1>
          <p className="text-xs text-neutral-300 mt-1 max-w-lg">
            Experience ultra-low latency synchronized music listening with your squad, friends, and family.
          </p>
        </div>

        {inRoom && (
          <button
            onClick={() => setInRoom(false)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={14} /> Leave Room
          </button>
        )}
      </div>

      {!inRoom ? (
        /* Create or Join Room Card */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Create Room Box */}
          <div className="p-8 rounded-3xl bg-[#1c2e56]/80 border border-[#2A3A5D] shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FF6B5B] text-white flex items-center justify-center mb-4 shadow-lg shadow-[#FF6B5B]/30">
                <Users size={28} />
              </div>
              <h2 className="text-2xl font-black text-[#F4EDE0]">Create a Jam Room</h2>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Be the DJ host. Control playback, curate a shared queue, and invite anyone with a quick 6-character room code.
              </p>
            </div>

            <button
              onClick={handleCreateRoom}
              className="mt-8 w-full py-3.5 px-6 rounded-2xl bg-[#FF6B5B] hover:bg-[#e85b4b] text-white font-bold text-sm transition-all shadow-xl shadow-[#FF6B5B]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Radio size={18} /> Start New Room
            </button>
          </div>

          {/* Join Room Box */}
          <div className="p-8 rounded-3xl bg-[#1c2e56]/80 border border-[#2A3A5D] shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#FF6B5B] flex items-center justify-center mb-4">
                <Sparkles size={28} />
              </div>
              <h2 className="text-2xl font-black text-[#F4EDE0]">Join a Friend</h2>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                Have a room code? Enter it below to join the sync session in high-fidelity audio.
              </p>
            </div>

            <form onSubmit={handleJoinRoom} className="mt-8 space-y-3">
              <input
                type="text"
                placeholder="e.g. VIBE-772"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full bg-[#14213D] border border-[#2A3A5D] focus:border-[#FF6B5B] text-white placeholder-neutral-400 font-mono text-center tracking-widest text-lg uppercase rounded-2xl py-3 px-4 outline-none"
              />
              <button
                type="submit"
                disabled={!joinCodeInput.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all border border-white/20 disabled:opacity-40 cursor-pointer"
              >
                Join Jam Session
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Inside Active Room View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Sync Player & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Banner */}
            <div className="p-6 rounded-3xl bg-[#1c2e56] border border-[#2A3A5D] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                  Active Room Code
                </span>
                <div className="text-3xl font-black text-[#FF6B5B] font-mono tracking-widest mt-0.5">
                  {roomCode}
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4EDE0] text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                {copied ? 'Code Copied!' : 'Copy Code'}
              </button>
            </div>

            {/* Now Synchronized Playing */}
            <div className="p-6 rounded-3xl bg-[#1c2e56]/80 border border-[#2A3A5D] space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Syncing Now
                </span>
                <span>320 kbps Lossless</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-xl border border-white/10">
                  <img
                    src={currentSong?.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'}
                    alt={currentSong?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-black text-[#F4EDE0] truncate">
                    {currentSong?.title || 'Chaleya'}
                  </h3>
                  <p className="text-xs text-neutral-300 truncate mt-0.5">
                    {currentSong?.artist || 'Arijit Singh, Shilpa Rao'}
                  </p>
                  <p className="text-[11px] text-[#FF6B5B] font-medium mt-1">
                    Playing for all 3 participants in sync
                  </p>
                </div>
              </div>

              {/* Live Reactions Bar */}
              <div className="pt-3 border-t border-[#2A3A5D] flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-300">Send Reaction:</span>
                <div className="flex items-center gap-2">
                  {['🔥', '❤️', '🕺', '🚀', '✨'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => triggerReaction(emoji)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-lg hover:scale-125 transition-all cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shared Collaborative Queue */}
            <div className="p-6 rounded-3xl bg-[#1c2e56]/80 border border-[#2A3A5D] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#F4EDE0] font-bold">
                  <Music size={18} className="text-[#FF6B5B]" />
                  <span>Shared Jam Queue</span>
                </div>
                <span className="text-xs text-neutral-300">{sharedQueue.length} songs</span>
              </div>

              <div className="space-y-2">
                {sharedQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#14213D] hover:bg-[#182747] border border-[#2A3A5D] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-neutral-400 w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#F4EDE0] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-neutral-300 truncate">
                          {item.artist}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FF6B5B]/20 text-[#FF6B5B]">
                      Added by {item.addedBy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Participants Side Panel */}
          <div className="p-6 rounded-3xl bg-[#1c2e56]/80 border border-[#2A3A5D] space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-[#2A3A5D] pb-3">
              <div className="flex items-center gap-2 text-[#F4EDE0] font-bold text-sm">
                <Users size={18} className="text-[#FF6B5B]" />
                <span>Listeners in Room</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                3 online
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_PARTICIPANTS.map((part) => (
                <div key={part.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={part.avatar}
                      alt={part.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#2A3A5D]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#14213D]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#F4EDE0] truncate">
                      {part.name}
                    </p>
                    <p className="text-[10px] text-neutral-300">
                      {part.isHost ? 'Host DJ' : 'Listening in Sync'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#2A3A5D] text-xs text-neutral-300">
              <p className="font-semibold text-[#F4EDE0] mb-1">How it works:</p>
              <p className="text-[11px] leading-relaxed">
                When the host pauses, plays, seeks, or switches tracks, audio syncs instantly on all devices.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TogetherModePage;
