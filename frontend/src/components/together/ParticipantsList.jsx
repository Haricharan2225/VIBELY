import React from 'react';
import { Crown, Volume2 } from 'lucide-react';

export const ParticipantsList = ({ participants = [] }) => {
  return (
    <div className="space-y-3">
      {participants.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-[#14213D] border border-[#2A3A5D]"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#14213D]" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#F4EDE0] flex items-center gap-1.5">
                {user.name}
                {user.isHost && (
                  <Crown size={12} className="text-amber-400 fill-current" />
                )}
              </p>
              <p className="text-[10px] text-neutral-400">
                {user.isHost ? 'DJ Host' : 'Listener'}
              </p>
            </div>
          </div>

          <div className="text-neutral-400">
            <Volume2 size={15} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsList;
