import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Shuffle, Clock, ArrowLeft, Disc3, Trash2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import Loader from '../components/common/Loader';

const SAMPLE_PLAYLIST_DETAILS = {
  id: 'pl-1',
  title: 'Telugu Melody Wave',
  description: 'Soul-touching melodies and soothing acoustic vibrations from Tollywood legends.',
  coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600',
  creator: 'Vibely Editorial',
  songs: [
    {
      id: 'pl-s1',
      title: 'Sammohanuda',
      artist: 'Shreya Ghoshal',
      album: 'Rules Ranjann',
      genre: 'Telugu',
      duration: 215,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'pl-s2',
      title: 'Adiga Adiga',
      artist: 'Sid Sriram',
      album: 'Ninnu Kori',
      genre: 'Telugu',
      duration: 220,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'pl-s3',
      title: 'Inkem Inkem Inkem Kaavaale',
      artist: 'Sid Sriram',
      album: 'Geetha Govindam',
      genre: 'Telugu',
      duration: 266,
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ],
};

export const PlaylistPage = () => {
  const { id } = useParams();
  const { setQueue, toggleShuffle } = usePlayer();
  const [playlist, setPlaylist] = useState(SAMPLE_PLAYLIST_DETAILS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getPlaylistById(id);
        if (res.data) setPlaylist(res.data);
      } catch (e) {
        setPlaylist((prev) => ({ ...prev, id }));
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handlePlayAll = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      setQueue(playlist.songs, 0);
    }
  };

  const handleShuffle = () => {
    toggleShuffle();
    handlePlayAll();
  };

  const handleRemoveSong = (songId) => {
    setPlaylist((prev) => ({
      ...prev,
      songs: prev.songs.filter((s) => s.id !== songId),
    }));
  };

  if (loading) {
    return <Loader text="Loading playlist tracks..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Link
        to="/library"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Library
      </Link>

      {/* Playlist Hero */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#222226]">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C6F432]">
            Curated Playlist
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            {playlist.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl">
            {playlist.description}
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            Created by <span className="text-white font-medium">{playlist.creator}</span> • {playlist.songs?.length || 0} tracks
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
            <button
              onClick={handlePlayAll}
              disabled={!playlist.songs?.length}
              className="px-7 py-3 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/25 cursor-pointer disabled:opacity-50"
            >
              <Play size={18} className="fill-current" /> Play All
            </button>

            <button
              onClick={handleShuffle}
              disabled={!playlist.songs?.length}
              className="px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#333336] hover:bg-[#2A2A2D] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Shuffle size={16} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="space-y-2 max-w-4xl">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 pb-2 border-b border-[#1A1A1D]">
          <span>Track</span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> Time
          </span>
        </div>

        {playlist.songs?.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            No tracks in this playlist yet. Add songs from Explore or Search!
          </div>
        ) : (
          <div className="space-y-1">
            {playlist.songs?.map((song) => (
              <div key={song.id} className="relative group">
                <SongCard song={song} layout="row" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
