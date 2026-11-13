import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Heart,
  Plus,
  Share2,
  Disc3,
  ArrowLeft,
  Music,
  Check,
  Sparkles,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { musicApi } from '../services/api';
import SongCard from '../components/common/SongCard';
import Loader from '../components/common/Loader';
import SongMeaningModal from '../components/music/SongMeaningModal';

const SAMPLE_SONG = {
  id: 'song-detail-1',
  title: 'Sammohanuda',
  artist: 'Shreya Ghoshal',
  album: 'Rules Ranjann',
  genre: 'Telugu',
  duration: 215,
  releaseYear: '2023',
  plays: '28,450,210',
  coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  lyrics: `Sammohanudaa... Nee chupula bhaanamaa
Manasantaa allukundiraa nee premagaa
Valape madhuram... Nee vaipe na payanam
Gundello cheri maayale chesaavu raa...`,
};

const RELATED_TRACKS = [
  {
    id: 'rel-1',
    title: 'Adiga Adiga',
    artist: 'Sid Sriram',
    album: 'Ninnu Kori',
    genre: 'Telugu',
    duration: 220,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'rel-2',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Hindi',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const SongDetailPage = () => {
  const { id } = useParams();
  const { currentSong, isPlaying, play, pause } = usePlayer();

  const [song, setSong] = useState(SAMPLE_SONG);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [showMeaningModal, setShowMeaningModal] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      try {
        const res = await musicApi.getSongById(id);
        if (res.data) setSong(res.data);
      } catch (e) {
        // Fallback to sample song
        setSong((prev) => ({ ...prev, id }));
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const isCurrentPlaying = currentSong?.id === song.id && isPlaying;

  const handlePlayToggle = () => {
    if (isCurrentPlaying) {
      pause();
    } else {
      play(song);
    }
  };

  const handleAddToPlaylist = () => {
    setAddedToPlaylist(true);
    setTimeout(() => setAddedToPlaylist(false), 2500);
  };

  if (loading) {
    return <Loader text="Loading track..." />;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Back navigation */}
      <div>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {/* Hero Track Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 p-6 sm:p-8 rounded-3xl bg-[#141416] border border-[#222226]">
        {/* Cover Art */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shrink-0 group border border-white/10">
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1D] border border-[#333336] text-xs font-semibold text-[#C6F432] mb-3">
            <Disc3 size={14} />
            <span>{song.genre} • High Definition Lossless</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {song.title}
          </h1>

          <p className="text-base text-neutral-300 font-medium mt-1">
            {song.artist}
          </p>

          <p className="text-xs text-neutral-400 mt-2">
            Album: <span className="text-white font-medium">{song.album}</span> • Released in {song.releaseYear || '2023'} • {song.plays || '15M'} plays
          </p>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
            <button
              onClick={handlePlayToggle}
              className="px-7 py-3 rounded-full bg-[#C6F432] text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#C6F432]/25 cursor-pointer"
            >
              {isCurrentPlaying ? (
                <>
                  <Pause size={18} className="fill-current" /> Pause
                </>
              ) : (
                <>
                  <Play size={18} className="fill-current" /> Play Song
                </>
              )}
            </button>

            <button
              onClick={() => setIsLiked((prev) => !prev)}
              className={`p-3 rounded-full border border-[#333336] hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer ${
                isLiked ? 'text-rose-500 fill-current bg-rose-500/10 border-rose-500/40' : 'text-neutral-300 bg-[#1A1A1D]'
              }`}
              title="Like track"
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={handleAddToPlaylist}
              className="px-4 py-3 rounded-full bg-[#1A1A1D] border border-[#333336] hover:bg-[#2A2A2D] text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {addedToPlaylist ? (
                <>
                  <Check size={16} className="text-[#C6F432]" /> Added to Library
                </>
              ) : (
                <>
                  <Plus size={16} /> Add to Playlist
                </>
              )}
            </button>

            <button
              onClick={() => setShowMeaningModal(true)}
              className="px-4 py-3 rounded-full bg-[#C6F432]/10 border border-[#C6F432]/30 hover:bg-[#C6F432]/20 text-[#C6F432] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles size={16} /> AI Song Meaning
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics Snippet */}
      {song.lyrics && (
        <div className="p-6 rounded-3xl bg-[#141416] border border-[#222226] max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Music size={18} className="text-[#C6F432]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
              Lyrics Preview
            </h3>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed font-serif italic whitespace-pre-line">
            "{song.lyrics}"
          </p>
        </div>
      )}

      {/* Related Tracks */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Recommended If You Like This</h3>
        <div className="space-y-1.5 max-w-3xl">
          {RELATED_TRACKS.map((track) => (
            <SongCard key={track.id} song={track} layout="row" />
          ))}
        </div>
      </div>

      {/* AI Song Meaning Modal */}
      <SongMeaningModal
        isOpen={showMeaningModal}
        onClose={() => setShowMeaningModal(false)}
        song={song}
      />
    </div>
  );
};

export default SongDetailPage;
