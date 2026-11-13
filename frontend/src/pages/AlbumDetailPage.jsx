import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Shuffle, Heart, Clock, ArrowLeft, Disc } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import Loader from '../components/common/Loader';

const SAMPLE_ALBUM = {
  id: 'alb-1',
  title: 'Jawan (Original Motion Picture Soundtrack)',
  artist: 'Anirudh Ravichander',
  releaseYear: '2023',
  coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
  songs: [
    {
      id: 'alb-s1',
      title: 'Chaleya',
      artist: 'Arijit Singh, Shilpa Rao',
      album: 'Jawan',
      genre: 'Hindi',
      duration: 200,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'alb-s2',
      title: 'Zinda Banda',
      artist: 'Anirudh Ravichander',
      album: 'Jawan',
      genre: 'Hindi',
      duration: 264,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'alb-s3',
      title: 'Not Ramaiya Vastavaiya',
      artist: 'Anirudh Ravichander, Vishal Dadlani',
      album: 'Jawan',
      genre: 'Hindi',
      duration: 203,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ],
};

export const AlbumDetailPage = () => {
  const { id } = useParams();
  const { setQueue, toggleShuffle } = usePlayer();
  const [album, setAlbum] = useState(SAMPLE_ALBUM);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getAlbumById(id);
        if (res.data) setAlbum(res.data);
      } catch (e) {
        setAlbum((prev) => ({ ...prev, id }));
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const handlePlayAll = () => {
    if (album.songs && album.songs.length > 0) {
      setQueue(album.songs, 0);
    }
  };

  const handleShufflePlay = () => {
    toggleShuffle();
    handlePlayAll();
  };

  if (loading) {
    return <Loader text="Loading album..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Link
        to="/home"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#222226]">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-white/10">
          <img
            src={album.coverUrl}
            alt={album.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#C6F432]">
            Album
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            {album.title}
          </h1>
          <p className="text-sm font-semibold text-neutral-300 mt-2">
            {album.artist} • {album.releaseYear} • {album.songs?.length || 0} songs
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
            <button
              onClick={handlePlayAll}
              className="px-7 py-3 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/25 cursor-pointer"
            >
              <Play size={18} className="fill-current" /> Play All
            </button>

            <button
              onClick={handleShufflePlay}
              className="px-5 py-3 rounded-full bg-[#1A1A1D] border border-[#333336] hover:bg-[#2A2A2D] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Shuffle size={16} /> Shuffle
            </button>

            <button
              onClick={() => setIsLiked((prev) => !prev)}
              className={`p-3 rounded-full border border-[#333336] hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer ${
                isLiked ? 'text-rose-500 fill-current bg-rose-500/10' : 'text-neutral-300 bg-[#1A1A1D]'
              }`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
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

        <div className="space-y-1">
          {album.songs?.map((song) => (
            <SongCard key={song.id} song={song} layout="row" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailPage;
