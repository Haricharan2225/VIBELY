import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Clock, X, Disc3, Music2, User } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import SongCard from '../components/common/SongCard';
import ArtistCard from '../components/common/ArtistCard';
import PlaylistCard from '../components/common/PlaylistCard';
import Loader from '../components/common/Loader';
import { musicApi } from '../services/api';

const SAMPLE_DATABASE = [
  {
    id: 's-1',
    title: 'Sammohanuda',
    artist: 'Shreya Ghoshal',
    album: 'Rules Ranjann',
    genre: 'Telugu',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 's-2',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Hindi',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 's-3',
    title: 'Hukum',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    genre: 'Tamil',
    duration: 208,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 's-4',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    genre: 'English',
    duration: 230,
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 's-5',
    title: 'Adiga Adiga',
    artist: 'Sid Sriram',
    album: 'Ninnu Kori',
    genre: 'Telugu',
    duration: 220,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
];

const SAMPLE_ARTISTS = [
  { id: 'art-1', name: 'Sid Sriram', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 'art-2', name: 'Shreya Ghoshal', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
  { id: 'art-3', name: 'Anirudh Ravichander', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
  { id: 'art-4', name: 'Arijit Singh', imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400' },
];

const INITIAL_RECENT_SEARCHES = ['Sid Sriram', 'Anirudh', 'Telugu Melody', 'Chaleya', 'Jawan'];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Songs' | 'Artists'
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [loading, setLoading] = useState(false);
  const [songResults, setSongResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
      executeSearch(q);
    }
  }, [searchParams]);

  const executeSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSongResults([]);
      setArtistResults([]);
      return;
    }

    setLoading(true);
    try {
      // Try backend search API
      const res = await musicApi.search(searchTerm);
      if (res.data) {
        setSongResults(res.data.songs || []);
        setArtistResults(res.data.artists || []);
      }
    } catch (e) {
      // Local fallback matching
      const term = searchTerm.toLowerCase();
      const matchedSongs = SAMPLE_DATABASE.filter(
        (s) =>
          s.title.toLowerCase().includes(term) ||
          s.artist.toLowerCase().includes(term) ||
          s.genre.toLowerCase().includes(term)
      );
      const matchedArtists = SAMPLE_ARTISTS.filter((a) =>
        a.name.toLowerCase().includes(term)
      );
      setSongResults(matchedSongs);
      setArtistResults(matchedArtists);
    } finally {
      setLoading(false);
      // Add to recent
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== searchTerm.toLowerCase());
        return [searchTerm, ...filtered].slice(0, 8);
      });
    }
  };

  const handleSearchChange = (newVal) => {
    setQuery(newVal);
    if (!newVal.trim()) {
      setSearchParams({});
      setSongResults([]);
      setArtistResults([]);
    }
  };

  const handleSearchSubmit = (val) => {
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
      executeSearch(val.trim());
    }
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    setSearchParams({ q: term });
    executeSearch(term);
  };

  const removeRecent = (term, e) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item !== term));
  };

  const hasSearched = query.trim().length > 0;
  const noResults = hasSearched && !loading && songResults.length === 0 && artistResults.length === 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Search Bar Input */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-black text-white mb-4">Search</h1>
        <SearchBar
          value={query}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          placeholder="Search songs, artists, genres, or albums..."
          autoFocus={!initialQuery}
        />
      </div>

      {/* Filter Tabs when search active */}
      {hasSearched && (
        <div className="flex items-center gap-2 border-b border-[#1A1A1D] pb-3">
          {['All', 'Songs', 'Artists'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === tab
                  ? 'bg-[#C6F432] text-black font-bold'
                  : 'bg-[#1A1A1D] text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && <Loader text={`Searching for "${query}"...`} />}

      {/* Empty State (No search performed yet) */}
      {!hasSearched && !loading && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-neutral-400">
                <Clock size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Recent Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1A1D] hover:bg-[#2A2A2D] text-xs font-medium text-neutral-300 hover:text-white border border-[#2A2A2D] cursor-pointer group transition-colors"
                  >
                    <span>{term}</span>
                    <span
                      onClick={(e) => removeRecent(term, e)}
                      className="text-neutral-500 hover:text-neutral-300 p-0.5 rounded-full"
                    >
                      <X size={12} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-8 rounded-3xl bg-[#141416] border border-[#222226] text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#C6F432]/10 text-[#C6F432] flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Find your next favorite vibe</h3>
            <p className="text-xs text-neutral-400">
              Type an artist name, song title, or try searching for languages like Telugu or Hindi.
            </p>
          </div>
        </div>
      )}

      {/* No Results State */}
      {noResults && (
        <div className="p-12 text-center rounded-3xl bg-[#141416] border border-[#222226] max-w-lg mx-auto">
          <p className="text-lg font-bold text-white mb-2">No results found for "{query}"</p>
          <p className="text-xs text-neutral-400">
            Please make sure words are spelled correctly or try searching for another artist or track.
          </p>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !loading && !noResults && (
        <div className="space-y-8">
          {/* Songs section */}
          {(activeFilter === 'All' || activeFilter === 'Songs') && songResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Music2 size={18} className="text-[#C6F432]" />
                <h2 className="text-lg font-bold text-white">Songs</h2>
              </div>
              <div className="space-y-1.5 max-w-3xl">
                {songResults.map((song) => (
                  <SongCard key={song.id} song={song} layout="row" />
                ))}
              </div>
            </div>
          )}

          {/* Artists section */}
          {(activeFilter === 'All' || activeFilter === 'Artists') && artistResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User size={18} className="text-[#C6F432]" />
                <h2 className="text-lg font-bold text-white">Artists</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {artistResults.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
