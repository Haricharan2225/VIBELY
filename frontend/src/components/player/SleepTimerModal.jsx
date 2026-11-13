import React from 'react';
import { Moon, X, Clock, Check } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const SleepTimerModal = ({ isOpen, onClose }) => {
  const { sleepTimerRemaining, setSleepTimer, cancelSleepTimer } = usePlayer();

  if (!isOpen) return null;

  const presets = [
    { label: '5 minutes', value: 5 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
  ];

  const formatRemaining = (seconds) => {
    if (!seconds) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#141416] border border-[#2A2A2E] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#C6F432]/10 text-[#C6F432]">
              <Moon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sleep Timer</h3>
              <p className="text-xs text-neutral-400">Audio will automatically pause</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#222226] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Active Timer Display */}
        {sleepTimerRemaining !== null && sleepTimerRemaining > 0 && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#C6F432]/10 border border-[#C6F432]/20">
            <div className="flex items-center gap-2 text-[#C6F432]">
              <Clock size={18} className="animate-pulse" />
              <span className="text-sm font-semibold">Stops in {formatRemaining(sleepTimerRemaining)}</span>
            </div>
            <button
              onClick={() => {
                cancelSleepTimer();
              }}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors cursor-pointer"
            >
              Turn off
            </button>
          </div>
        )}

        {/* Preset Options */}
        <div className="space-y-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setSleepTimer(preset.value);
                onClose();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1A1A1D] hover:bg-[#26262B] text-neutral-200 text-sm font-medium transition-colors cursor-pointer border border-transparent hover:border-[#333336]"
            >
              <span>{preset.label}</span>
              {sleepTimerRemaining && Math.round(sleepTimerRemaining / 60) === preset.value && (
                <Check size={16} className="text-[#C6F432]" />
              )}
            </button>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-[#222226] hover:bg-[#2A2A2E] text-neutral-300 text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SleepTimerModal;
