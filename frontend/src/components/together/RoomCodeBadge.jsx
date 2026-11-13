import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

export const RoomCodeBadge = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my VIBELY Jam',
          text: `Join my live synced music room on VIBELY with code: ${code}`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn('Share cancelled or error:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-[#14213D] border border-[#2A3A5D]">
      <div className="px-3 py-1 rounded-xl bg-black/30 text-[#FF6B5B] font-mono font-black text-sm tracking-widest">
        {code}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Copy room code"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Share room link"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default RoomCodeBadge;
