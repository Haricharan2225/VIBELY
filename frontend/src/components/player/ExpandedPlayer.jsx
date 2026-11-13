import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  Share2,
  ListMusic,
  Disc3,
  Moon,
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import QueueView from './QueueView';
import SleepTimerModal from './SleepTimerModal';

export const ExpandedPlayer = () => {
  const {
    currentSong,
    isExpanded,
    setIsExpanded,
    progress,
    duration,
    seek,
    sleepTimerRemaining,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'queue'
  const [isLiked, setIsLiked] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);

  if (!isExpanded || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B0C] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
      {/* Dynamic blurred ambient glow behind the art */}
      <div
        className="absolute inset-0 opacity-20 blur-[120px] pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${currentSong.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <button
          onClick={() => setIsExpanded(false)}
          className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title="Minimize"
        >
          <ChevronDown size={28} />
        </button>

        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Playing from
          </p>
          <p className="text-xs font-semibold text-white">
            {currentSong.album || currentSong.genre || 'Vibely Playlist'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSleepTimer(true)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              sleepTimerRemaining
                ? 'bg-[#C6F432]/20 text-[#C6F432] border border-[#C6F432]/30'
                : 'hover:bg-white/10 text-neutral-300'
            }`}
            title={sleepTimerRemaining ? `Sleep timer active (${Math.ceil(sleepTimerRemaining / 60)}m)` : 'Set Sleep Timer'}
          >
            <Moon size={20} />
          </button>

          <button
            onClick={() => setActiveTab((prev) => (prev === 'player' ? 'queue' : 'player'))}
            className={`p-2 rounded-full transition-colors ${
              activeTab === 'queue'
                ? 'bg-[#C6F432] text-black font-semibold'
                : 'hover:bg-white/10 text-neutral-300'
            }`}
            title="Toggle Queue"
          >
            <ListMusic size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        {activeTab === 'player' ? (
          <>
            {/* Large Album Artwork */}
            <div className="relative aspect-square w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl mb-8 group border border-white/10">
              <img
                src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600'}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-[#C6F432] flex items-center gap-1.5 border border-white/10">
                <Disc3 size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>{currentSong.genre || 'Vibe'}</span>
              </div>
            </div>

            {/* Song Meta & Actions */}
            <div className="w-full flex items-center justify-between mb-6">
              <div className="min-w-0 pr-3">
                <h2 className="text-2xl font-extrabold text-white truncate tracking-tight">
                  {currentSong.title}
                </h2>
                <p className="text-sm font-medium text-neutral-400 truncate mt-0.5">
                  {currentSong.artist}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsLiked((prev) => !prev)}
                  className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${
                    isLiked ? 'text-rose-500 fill-current' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Like"
                >
                  <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full mb-6">
              <ProgressBar
                progress={progress}
                duration={duration}
                onSeek={seek}
                showTimes={true}
                height="h-1.5"
                hoverHeight="h-2.5"
              />
            </div>

            {/* Player Controls */}
            <div className="w-full mb-6">
              <PlayerControls size="lg" />
            </div>

            {/* Volume Control */}
            <div className="w-full flex justify-center pt-2">
              <VolumeControl className="px-4 py-2 rounded-full bg-white/5 border border-white/10" />
            </div>
          </>
        ) : (
          <div className="w-full h-[520px]">
            <QueueView onClose={() => setActiveTab('player')} />
          </div>
        )}
      </div>

      {/* Bottom spacer / Footer */}
      <div className="relative z-10 p-4 text-center text-xs text-neutral-500">
        VIBELY STREAMING ENGINE
      </div>

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={showSleepTimer}
        onClose={() => setShowSleepTimer(false)}
      />
    </div>
  );
};

export default ExpandedPlayer;
