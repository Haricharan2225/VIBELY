import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, CheckCircle2, UserPlus, UserCheck, ArrowLeft, Disc3 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import Loader from '../components/common/Loader';

const SAMPLE_ARTIST = {
  id: 'art-1',
  name: 'Sid Sriram',
  genre: 'Telugu / Carnatic / Melody',
  monthlyListeners: '8,421,900',
  bio: 'Sid Sriram is an Indian-American playback singer and composer known for soul-stirring melodies and fusion vocals.',
  bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  topSongs: [
    {
      id: 'sid-1',
      title: 'Adiga Adiga',
      artist: 'Sid Sriram',
      album: 'Ninnu Kori',
      genre: 'Telugu',
      duration: 220,
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: 'sid-2',
      title: 'Inkem Inkem Inkem Kaavaale',
      artist: 'Sid Sriram',
      album: 'Geetha Govindam',
      genre: 'Telugu',
      duration: 266,
      coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 'sid-3',
      title: 'Samajavaragamana',
      artist: 'Sid Sriram',
      album: 'Ala Vaikunthapurramuloo',
      genre: 'Telugu',
      duration: 214,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ],
};

export const ArtistDetailPage = () => {
  const { id } = useParams();
  const { setQueue } = usePlayer();
  const [artist, setArtist] = useState(SAMPLE_ARTIST);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getArtistById(id);
        if (res.data) setArtist(res.data);
      } catch (e) {
        setArtist((prev) => ({ ...prev, id }));
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handlePlayArtist = () => {
    if (artist.topSongs && artist.topSongs.length > 0) {
      setQueue(artist.topSongs, 0);
    }
  };

  if (loading) {
    return <Loader text="Loading artist profile..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <Link
        to="/home"
        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[320px] flex flex-col justify-end p-6 sm:p-8 bg-[#141416] border border-[#222226]">
        {/* Banner Image Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-50"
          style={{ backgroundImage: `url(${artist.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/60 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-2xl border-4 border-[#0B0B0C] shrink-0">
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C6F432]">
              <CheckCircle2 size={16} /> Verified Artist
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
              {artist.name}
            </h1>
            <p className="text-xs text-neutral-300 mt-2">
              {artist.monthlyListeners} monthly listeners • {artist.genre}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-5">
              <button
                onClick={handlePlayArtist}
                className="px-6 py-2.5 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/25 cursor-pointer"
              >
                <Play size={18} className="fill-current" /> Play
              </button>

              <button
                onClick={() => setIsFollowing((prev) => !prev)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-transparent border-[#C6F432] text-[#C6F432]'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={16} /> Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Follow
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="space-y-4 max-w-4xl">
        <h2 className="text-xl font-bold text-white">Popular Songs</h2>
        <div className="space-y-1">
          {artist.topSongs?.map((song) => (
            <SongCard key={song.id} song={song} layout="row" />
          ))}
        </div>
      </div>

      {/* Bio Card */}
      {artist.bio && (
        <div className="p-6 rounded-3xl bg-[#141416] border border-[#222226] max-w-3xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
            About {artist.name}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {artist.bio}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArtistDetailPage;
