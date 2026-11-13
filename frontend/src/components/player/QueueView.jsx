import React from 'react';
import { Trash2, Music, X } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const QueueView = ({ onClose }) => {
  const {
    queue,
    currentIndex,
    play,
    removeFromQueue,
    clearQueue,
  } = usePlayer();

  return (
    <div className="flex flex-col h-full bg-[#141416] border border-[#2A2A2D] rounded-2xl p-4 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2D] mb-3">
        <div className="flex items-center gap-2">
          <Music size={18} className="text-[#C6F432]" />
          <h3 className="font-bold text-white text-base">Play Queue</h3>
          <span className="text-xs text-neutral-400">({queue.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="text-xs text-neutral-400 hover:text-rose-400 transition-colors px-2 py-1 rounded-md hover:bg-neutral-800"
              title="Clear queue"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-neutral-500 text-sm">
            <p>Queue is empty</p>
          </div>
        ) : (
          queue.map((song, index) => {
            const isPlayingThis = index === currentIndex;
            return (
              <div
                key={`${song.id}-${index}`}
                onClick={() => play(song)}
                className={`group flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                  isPlayingThis
                    ? 'bg-[#1A1A1D] border border-[#C6F432]/40 text-[#C6F432]'
                    : 'hover:bg-[#1A1A1D] text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                    <img
                      src={song.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200'}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isPlayingThis ? 'text-[#C6F432]' : 'text-white'
                      }`}
                    >
                      {song.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isPlayingThis && (
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#C6F432]/20 text-[#C6F432]">
                      Playing
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-400 transition-opacity"
                    title="Remove from queue"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default QueueView;
