import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft, Disc3 } from 'lucide-react';
import { GENRE_COLORS } from '../utils/brand';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import Loader from '../components/common/Loader';

const FALLBACK_GENRE_SONGS = {
  telugu: [
    {
      id: 'tel-1',
      title: 'Sammohanuda',
      artist: 'Shreya Ghoshal',
      album: 'Rules Ranjann',
      genre: 'Telugu',
      duration: 215,
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'tel-2',
      title: 'Adiga Adiga',
      artist: 'Sid Sriram',
      album: 'Ninnu Kori',
      genre: 'Telugu',
      duration: 220,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'tel-3',
      title: 'Inkem Inkem Inkem Kaavaale',
      artist: 'Sid Sriram',
      album: 'Geetha Govindam',
      genre: 'Telugu',
      duration: 266,
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ],
  hindi: [
    {
      id: 'hin-1',
      title: 'Chaleya',
      artist: 'Arijit Singh, Shilpa Rao',
      album: 'Jawan',
      genre: 'Hindi',
      duration: 200,
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'hin-2',
      title: 'Apna Bana Le',
      artist: 'Arijit Singh, Sachin-Jigar',
      album: 'Bhediya',
      genre: 'Hindi',
      duration: 261,
      coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
  ],
};

export const GenrePage = () => {
  const { genreName = '' } = useParams();
  const { setQueue } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Capitalize for display
  const title = genreName.charAt(0).toUpperCase() + genreName.slice(1);
  const gradientClass = GENRE_COLORS[title] || 'from-neutral-800 to-zinc-950';

  useEffect(() => {
    const fetchGenreSongs = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getByGenre(genreName);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setSongs(res.data);
          return;
        }
      } catch (e) {
        console.warn('API genre fetch warning:', e);
      } finally {
        setLoading(false);
      }

      // Fallback
      const normalized = genreName.toLowerCase();
      const mockList = FALLBACK_GENRE_SONGS[normalized] || FALLBACK_GENRE_SONGS['telugu'];
      setSongs(mockList);
    };

    fetchGenreSongs();
  }, [genreName]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setQueue(songs, 0);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Explore
        </Link>
      </div>

      {/* Hero Banner with Genre Colors */}
      <div
        className={`relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r ${gradientClass} overflow-hidden shadow-2xl flex flex-col justify-end min-h-[220px]`}
      >
        <div className="absolute right-6 -bottom-6 text-white/10 pointer-events-none">
          <Disc3 size={180} />
        </div>

        <div className="relative z-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
            Genre & Category
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-1 drop-shadow-md">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-2 max-w-lg">
            Immerse yourself in the best of {title} rhythms, soulful vocals and trending beats.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handlePlayAll}
              className="px-6 py-3 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-black/30 cursor-pointer"
            >
              <Play size={18} className="fill-current" /> Play All
            </button>
            <span className="text-xs font-medium text-white/80">
              {songs.length} tracks
            </span>
          </div>
        </div>
      </div>

      {/* Song Tracklist */}
      {loading ? (
        <Loader text={`Loading ${title} tracks...`} />
      ) : (
        <div className="space-y-2 max-w-4xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 px-3">
            Popular Tracks
          </h3>
          <div className="space-y-1">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} layout="row" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenrePage;
