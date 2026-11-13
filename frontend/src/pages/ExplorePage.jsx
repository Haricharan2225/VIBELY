import React, { useState } from 'react';
import { Compass, Flame, Sparkles, Filter } from 'lucide-react';
import GenreCard from '../components/common/GenreCard';
import SongCard from '../components/common/SongCard';
import { GENRES } from '../utils/brand';

const MOODS = [
  'All',
  'Late Night',
  'Energetic',
  'Chill & Acoustic',
  'Party & Dance',
  'Focus & Study',
  'Rainy Day',
  'Romantic Vibes',
];

const EXPLORE_SONGS = [
  {
    id: 'exp-1',
    title: 'Adiga Adiga',
    artist: 'Sid Sriram',
    album: 'Ninnu Kori',
    genre: 'Telugu',
    duration: 220,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'exp-2',
    title: 'Kesariya',
    artist: 'Arijit Singh, Pritam',
    album: 'Brahmastra',
    genre: 'Hindi',
    duration: 268,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'exp-3',
    title: 'Arabic Kuthu - Halamithi Habibo',
    artist: 'Anirudh Ravichander, Jonita Gandhi',
    album: 'Beast',
    genre: 'Tamil',
    duration: 279,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'exp-4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    genre: 'English',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 'exp-5',
    title: 'Inkem Inkem Inkem Kaavaale',
    artist: 'Sid Sriram',
    album: 'Geetha Govindam',
    genre: 'Telugu',
    duration: 266,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: 'exp-6',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    album: 'Bhediya',
    genre: 'Hindi',
    duration: 261,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
];

export const ExplorePage = () => {
  const [selectedMood, setSelectedMood] = useState('All');

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2.5 text-[#C6F432] mb-1">
          <Compass size={24} />
          <span className="text-xs font-bold uppercase tracking-widest">Discover New Vibes</span>
        </div>
        <h1 className="text-3xl font-black text-white">Explore & Browse</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Dive into regional languages, mood frequencies and trending charts.
        </p>
      </div>

      {/* Mood Filters */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-neutral-400" />
          <h2 className="text-sm font-bold text-neutral-300">Filter by Mood</h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedMood === mood
                  ? 'bg-[#C6F432] text-black shadow-md shadow-[#C6F432]/20'
                  : 'bg-[#1A1A1D] text-neutral-300 hover:text-white hover:bg-[#2A2A2D] border border-[#333336]'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Grid of Songs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-rose-500" />
            <h2 className="text-lg font-bold text-white">
              {selectedMood === 'All' ? 'Trending Discoveries' : `${selectedMood} Tracks`}
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Updated hourly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {EXPLORE_SONGS.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>

      {/* Browse All Genres Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-[#C6F432]" />
          <h2 className="text-lg font-bold text-white">Browse By Genre & Language</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {GENRES.map((genre) => (
            <GenreCard key={genre} genre={genre} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
