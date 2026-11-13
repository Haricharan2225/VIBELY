import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, TrendingUp, Flame, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import PlaylistCard from '../components/common/PlaylistCard';
import GenreCard from '../components/common/GenreCard';
import ArtistCard from '../components/common/ArtistCard';
import Loader from '../components/common/Loader';
import { GENRES } from '../utils/brand';

// Initial curated fallback data for seamless instantaneous display
const MOCK_FEATURED_SONG = {
  id: 'ft-1',
  title: 'Chittamma',
  artist: 'Ram Miriyala, Anurag Kulkarni',
  album: 'Tribanadhari Barbarik',
  genre: 'Telugu',
  duration: 230,
  coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

const MOCK_POPULAR_SONGS = [
  {
    id: 'pop-1',
    title: 'Sammohanuda',
    artist: 'Shreya Ghoshal',
    album: 'Rules Ranjann',
    genre: 'Telugu',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'pop-2',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Hindi',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'pop-3',
    title: 'Hukum - Thalaivar Alappara',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    genre: 'Tamil',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'pop-4',
    title: 'O Maahi',
    artist: 'Arijit Singh',
    album: 'Dunki',
    genre: 'Hindi',
    duration: 233,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 'pop-5',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    genre: 'English',
    duration: 230,
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
];

const MOCK_PLAYLISTS = [
  {
    id: 'pl-1',
    title: 'Telugu Melody Wave',
    description: 'Soul-touching melodies from Tollywood legends',
    songCount: 45,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pl-2',
    title: 'Bollywood Romance Rewind',
    description: 'Timeless love anthems for heart & soul',
    songCount: 52,
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pl-3',
    title: 'Anirudh High Voltage',
    description: 'Pure rockstar energy & bass drops',
    songCount: 38,
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'pl-4',
    title: 'Late Night Study Lo-Fi',
    description: 'Chill beats to focus, relax and vibe',
    songCount: 60,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
  },
];

const MOCK_ARTISTS = [
  { id: 'art-1', name: 'Sid Sriram', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 'art-2', name: 'Shreya Ghoshal', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
  { id: 'art-3', name: 'Anirudh', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
  { id: 'art-4', name: 'Arijit Singh', imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400' },
  { id: 'art-5', name: 'Taylor Swift', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
];

export const HomePage = () => {
  const { user, dbUser } = useAuth();
  const { play } = usePlayer();

  const [loading, setLoading] = useState(false);
  const [popularSongs, setPopularSongs] = useState(MOCK_POPULAR_SONGS);
  const [playlists, setPlaylists] = useState(MOCK_PLAYLISTS);
  const [featuredSong, setFeaturedSong] = useState(MOCK_FEATURED_SONG);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userName = dbUser?.displayName || user?.displayName || 'Listener';

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featuredRes, trendingRes, playlistsRes] = await Promise.allSettled([
          musicApi.getFeatured(),
          musicApi.getTrending(),
          musicApi.getPlaylists(),
        ]);

        if (featuredRes.status === 'fulfilled' && featuredRes.value?.data) {
          setFeaturedSong(featuredRes.value.data);
        }
        if (trendingRes.status === 'fulfilled' && Array.isArray(trendingRes.value?.data)) {
          setPopularSongs(trendingRes.value.data);
        }
        if (playlistsRes.status === 'fulfilled' && Array.isArray(playlistsRes.value?.data)) {
          setPlaylists(playlistsRes.value.data);
        }
      } catch (err) {
        console.warn('API fetch warning, using curated mock catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader text="Setting up your stage..." />;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Header Greeting & Together Mode Promo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{getGreeting()},</span>
            <span className="text-[#C6F432]">{userName}</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Ready to explore today's top picks and customized vibes?
          </p>
        </div>

        {/* Together Banner Pill */}
        <Link
          to="/together"
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#14213D] to-[#1c2e56] border border-[#2A3A5D] rounded-2xl hover:border-[#FF6B5B] transition-all group shadow-md"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FF6B5B] text-white flex items-center justify-center shrink-0">
            <Radio size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white group-hover:text-[#FF6B5B] transition-colors">
                Listen Together
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5B] animate-ping" />
            </div>
            <p className="text-[11px] text-neutral-300">Join friends in real-time rooms</p>
          </div>
        </Link>
      </div>

      {/* Hero Featured Release Card */}
      {featuredSong && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C6F432]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6F432]/20 text-[#C6F432] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Featured of the day
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight line-clamp-2">
              {featuredSong.title}
            </h2>
            <p className="text-sm font-medium text-neutral-300 mt-2">
              By <span className="text-white font-semibold">{featuredSong.artist}</span> • {featuredSong.album}
            </p>
            <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
              Experience dynamic soundstage and crystal clear vocals on VIBELY Engine.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => play(featuredSong)}
                className="px-6 py-3 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 shadow-lg shadow-[#C6F432]/25 cursor-pointer"
              >
                <Play size={18} className="fill-current" />
                Play Now
              </button>
              <Link
                to={`/song/${featuredSong.id}`}
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                View Track
              </Link>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
            <img
              src={featuredSong.coverUrl}
              alt={featuredSong.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Genre Pills Quick Scroller */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Popular Genres & Vibes</h2>
          <Link to="/explore" className="text-xs font-semibold text-[#C6F432] hover:underline">
            View all
          </Link>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {GENRES.map((genre) => (
            <GenreCard key={genre} genre={genre} variant="pill" />
          ))}
        </div>
      </div>

      {/* Popular Hits Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold text-white">Trending Hits</h2>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-neutral-400 hover:text-white">
            See more
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>

      {/* Recommended Playlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[#C6F432]" size={20} />
            <h2 className="text-lg font-bold text-white">Handpicked Playlists</h2>
          </div>
          <Link to="/library" className="text-xs font-semibold text-neutral-400 hover:text-white">
            Explore Library
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>

      {/* Top Artists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Featured Artists</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MOCK_ARTISTS.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
