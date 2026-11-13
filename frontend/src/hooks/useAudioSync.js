import { useState, useEffect, useCallback } from 'react';
import { togetherApi } from '../services/api';

/**
 * Hook to manage room synchronisation in Together mode
 */
export function useAudioSync(roomId, isHost = false) {
  const [syncState, setSyncState] = useState({
    currentTime: 0,
    isPlaying: false,
    songId: null,
  });

  const broadcastState = useCallback(
    async (state) => {
      if (!roomId || !isHost) return;
      try {
        await togetherApi.syncState(roomId, state);
      } catch (err) {
        console.warn('Sync broadcast error:', err);
      }
    },
    [roomId, isHost]
  );

  return {
    syncState,
    broadcastState,
  };
}

export default useAudioSync;
