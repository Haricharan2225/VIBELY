import React, { useRef } from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const ProgressBar = ({
  progress = 0,
  duration = 0,
  onSeek,
  showTimes = true,
  height = 'h-1',
  hoverHeight = 'group-hover:h-2',
}) => {
  const barRef = useRef(null);

  const percentage = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  const handleClick = (e) => {
    if (!barRef.current || !duration || !onSeek) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div className="w-full flex items-center gap-2.5">
      {showTimes && (
        <span className="text-[11px] font-mono text-neutral-400 w-9 text-right shrink-0 select-none">
          {formatTime(progress)}
        </span>
      )}

      {/* Progress Track */}
      <div
        ref={barRef}
        onClick={handleClick}
        className={`group relative flex-1 cursor-pointer py-1.5 flex items-center`}
      >
        <div
          className={`w-full ${height} ${hoverHeight} bg-neutral-700 rounded-full overflow-hidden transition-all relative`}
        >
          {/* Filled Bar */}
          <div
            className="h-full bg-gradient-to-r from-white to-[#C6F432] rounded-full relative"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Thumb indicator on hover */}
        <div
          className="absolute w-3 h-3 bg-[#C6F432] rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {showTimes && (
        <span className="text-[11px] font-mono text-neutral-400 w-9 text-left shrink-0 select-none">
          {formatTime(duration)}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
