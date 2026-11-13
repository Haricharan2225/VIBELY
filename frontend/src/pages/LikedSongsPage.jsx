import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play, Shuffle, ArrowLeft, Clock } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import Loader from '../components/common/Loader';

const DEFAULT_LIKED = [
  {
    id: 'liked-1',
    title: 'Sammohanuda',
    artist: 'Shreya Ghoshal',
    album: 'Rules Ranjann',
    genre: 'Telugu',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'liked-2',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Hindi',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'liked-3',
    title: 'Hukum',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    genre: 'Tamil',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'liked-4',
    title: 'Adiga Adiga',
    artist: 'Sid Sriram',
    album: 'Ninnu Kori',
    genre: 'Telugu',
    duration: 220,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];

export const LikedSongsPage = () => {
  const { setQueue, toggleShuffle } = usePlayer();
  const [likedSongs, setLikedSongs] = useState(DEFAULT_LIKED);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getLikedSongs();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setLikedSongs(res.data);
        }
      } catch (e) {
        console.warn('API liked songs fetch warning:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setQueue(likedSongs, 0);
    }
  };

  const handleShuffle = () => {
    toggleShuffle();
    handlePlayAll();
  };

  const handleUnlike = (song) => {
    setLikedSongs((prev) => prev.filter((s) => s.id !== song.id));
    musicApi.toggleLikeSong(song.id).catch(() => {});
  };

  if (loading) {
    return <Loader text="Loading your favorites..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Link
        to="/library"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Library
      </Link>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-900/60 via-purple-900/40 to-[#141416] border border-rose-500/20 shadow-2xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-400 flex items-center justify-center text-white shadow-2xl shrink-0">
          <Heart size={80} className="fill-current drop-shadow-lg" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-400">
            Playlist
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
            Liked Songs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 font-medium">
            Your collection of {likedSongs.length} favorited tracks
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
            <button
              onClick={handlePlayAll}
              disabled={likedSongs.length === 0}
              className="px-7 py-3 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/25 cursor-pointer disabled:opacity-50"
            >
              <Play size={18} className="fill-current" /> Play All
            </button>

            <button
              onClick={handleShuffle}
              disabled={likedSongs.length === 0}
              className="px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#333336] hover:bg-[#2A2A2D] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Shuffle size={16} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-2 max-w-4xl">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 pb-2 border-b border-[#1A1A1D]">
          <span>Track</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> Time
          </span>
        </div>

        {likedSongs.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-sm">
            You haven't liked any songs yet. Tap the heart icon on any track to save it here!
          </div>
        ) : (
          <div className="space-y-1">
            {likedSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                layout="row"
                isLiked={true}
                onLike={handleUnlike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongsPage;
