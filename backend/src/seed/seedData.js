import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import Album from '../models/Album.js';
import Song from '../models/Song.js';

const DEMO_ARTISTS = [
  {
    name: 'Sid Sriram',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    bio: 'Indian-American carnatic musician, music producer, and playback singer known for soulful Telugu & Tamil melodies.',
    genres: ['Tollywood', 'Romantic', 'Classical'],
    verified: true
  },
  {
    name: 'Arijit Singh',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    bio: 'Acclaimed Indian playback singer and music composer, voice behind iconic Bollywood ballads.',
    genres: ['Bollywood', 'Romantic', 'Acoustic'],
    verified: true
  },
  {
    name: 'Anirudh Ravichander',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    bio: 'Dynamic Indian music composer and singer revolutionizing contemporary South Indian film music and EDM.',
    genres: ['Tollywood', 'EDM', 'Pop'],
    verified: true
  },
  {
    name: 'Dua Lipa',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    bio: 'English and Albanian singer-songwriter known for her signature disco-pop and dance-pop anthems.',
    genres: ['Pop', 'EDM'],
    verified: true
  },
  {
    name: 'The Weeknd',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
    bio: 'Canadian singer, songwriter, and record producer known for sonic versatility and dark R&B styling.',
    genres: ['R&B', 'Pop'],
    verified: true
  },
  {
    name: 'Shreya Ghoshal',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    bio: 'Celebrated Indian playback singer renowned for classical finesse and versatile multi-lingual hits.',
    genres: ['Bollywood', 'Classical', 'Devotional'],
    verified: true
  }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is required to run seed');
    }

    console.log('🔄 Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    console.log('🧹 Clearing previous demo data...');
    // Delete only items marked as demo or associated with demo seed
    await Song.deleteMany({ isDemo: true });
    // Also remove demo albums & demo artists
    const artistNames = DEMO_ARTISTS.map((a) => a.name);
    const existingArtists = await Artist.find({ name: { $in: artistNames } });
    const existingArtistIds = existingArtists.map((a) => a._id);

    await Album.deleteMany({ artist: { $in: existingArtistIds } });
    await Artist.deleteMany({ name: { $in: artistNames } });

    console.log('🎤 Seeding artists...');
    const createdArtists = await Artist.insertMany(DEMO_ARTISTS);
    const artistMap = {};
    createdArtists.forEach((artist) => {
      artistMap[artist.name] = artist;
    });

    console.log('💿 Seeding albums...');
    const demoAlbums = [
      {
        title: 'Samajavaragamana Special',
        artist: artistMap['Sid Sriram']._id,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        genre: 'Tollywood',
        releaseDate: new Date('2020-01-12')
      },
      {
        title: 'Soul of Arijit',
        artist: artistMap['Arijit Singh']._id,
        coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
        genre: 'Bollywood',
        releaseDate: new Date('2021-05-18')
      },
      {
        title: 'Hukum & Beats',
        artist: artistMap['Anirudh Ravichander']._id,
        coverUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=80',
        genre: 'Tollywood',
        releaseDate: new Date('2023-08-10')
      },
      {
        title: 'Future Vibes',
        artist: artistMap['Dua Lipa']._id,
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
        genre: 'Pop',
        releaseDate: new Date('2020-03-27')
      },
      {
        title: 'Midnight Echoes',
        artist: artistMap['The Weeknd']._id,
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80',
        genre: 'R&B',
        releaseDate: new Date('2022-01-07')
      },
      {
        title: 'Classical Bliss',
        artist: artistMap['Shreya Ghoshal']._id,
        coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
        genre: 'Classical',
        releaseDate: new Date('2022-11-15')
      }
    ];

    const createdAlbums = await Album.insertMany(demoAlbums);
    const albumMap = {};
    createdAlbums.forEach((album) => {
      albumMap[album.title] = album;
    });

    console.log('🎵 Seeding songs...');
    const demoSongs = [
      // Sid Sriram
      {
        title: 'Samajavaragamana',
        artist: artistMap['Sid Sriram']._id,
        album: albumMap['Samajavaragamana Special']._id,
        genre: 'Telugu',
        duration: 214,
        coverUrl: albumMap['Samajavaragamana Special'].coverUrl,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2020-01-12'),
        playCount: 15420,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Inkem Inkem Inkem Kaavaale',
        artist: artistMap['Sid Sriram']._id,
        album: albumMap['Samajavaragamana Special']._id,
        genre: 'Melody',
        duration: 266,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2018-07-10'),
        playCount: 24100,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Srivalli Acoustic Reprise',
        artist: artistMap['Sid Sriram']._id,
        album: albumMap['Samajavaragamana Special']._id,
        genre: 'Romantic',
        duration: 220,
        coverUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2021-12-17'),
        playCount: 31200,
        isDemo: true,
        license: 'demo-placeholder'
      },

      // Arijit Singh
      {
        title: 'Tum Hi Ho',
        artist: artistMap['Arijit Singh']._id,
        album: albumMap['Soul of Arijit']._id,
        genre: 'Hindi',
        duration: 262,
        coverUrl: albumMap['Soul of Arijit'].coverUrl,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2013-04-08'),
        playCount: 45000,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Kesariya',
        artist: artistMap['Arijit Singh']._id,
        album: albumMap['Soul of Arijit']._id,
        genre: 'Romantic',
        duration: 268,
        coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2022-07-17'),
        playCount: 52000,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Channa Mereya',
        artist: artistMap['Arijit Singh']._id,
        album: albumMap['Soul of Arijit']._id,
        genre: 'Heartbreak',
        duration: 289,
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2016-09-29'),
        playCount: 38400,
        isDemo: true,
        license: 'demo-placeholder'
      },

      // Anirudh Ravichander
      {
        title: 'Hukum - Thalaivar Alappara',
        artist: artistMap['Anirudh Ravichander']._id,
        album: albumMap['Hukum & Beats']._id,
        genre: 'Tamil',
        duration: 206,
        coverUrl: albumMap['Hukum & Beats'].coverUrl,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2023-07-17'),
        playCount: 68000,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Arabic Kuthu - Halamithi Habibo',
        artist: artistMap['Anirudh Ravichander']._id,
        album: albumMap['Hukum & Beats']._id,
        genre: 'Hip-hop',
        duration: 280,
        coverUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2022-02-14'),
        playCount: 74000,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Badass (Leo)',
        artist: artistMap['Anirudh Ravichander']._id,
        album: albumMap['Hukum & Beats']._id,
        genre: 'Rap',
        duration: 229,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2023-09-28'),
        playCount: 41200,
        isDemo: true,
        license: 'demo-placeholder'
      },

      // Dua Lipa
      {
        title: 'Levitating',
        artist: artistMap['Dua Lipa']._id,
        album: albumMap['Future Vibes']._id,
        genre: 'English',
        duration: 203,
        coverUrl: albumMap['Future Vibes'].coverUrl,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2020-03-27'),
        playCount: 92000,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: "Don't Start Now",
        artist: artistMap['Dua Lipa']._id,
        album: albumMap['Future Vibes']._id,
        genre: 'English',
        duration: 183,
        coverUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2019-10-31'),
        playCount: 88500,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Physical Instrumental Beat',
        artist: artistMap['Dua Lipa']._id,
        album: albumMap['Future Vibes']._id,
        genre: 'Instrumental',
        duration: 234,
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2020-01-30'),
        playCount: 46200,
        isDemo: true,
        license: 'demo-placeholder'
      },

      // The Weeknd
      {
        title: 'Blinding Lights',
        artist: artistMap['The Weeknd']._id,
        album: albumMap['Midnight Echoes']._id,
        genre: 'English',
        duration: 200,
        coverUrl: albumMap['Midnight Echoes'].coverUrl,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2019-11-29'),
        playCount: 125000,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Save Your Tears',
        artist: artistMap['The Weeknd']._id,
        album: albumMap['Midnight Echoes']._id,
        genre: 'Heartbreak',
        duration: 215,
        coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2020-08-09'),
        playCount: 94100,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Starboy Lo-Fi Chill',
        artist: artistMap['The Weeknd']._id,
        album: albumMap['Midnight Echoes']._id,
        genre: 'Instrumental',
        duration: 230,
        coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2022-01-07'),
        playCount: 39500,
        isDemo: true,
        license: 'demo-placeholder'
      },

      // Shreya Ghoshal
      {
        title: 'Deewani Mastani',
        artist: artistMap['Shreya Ghoshal']._id,
        album: albumMap['Classical Bliss']._id,
        genre: 'Classical',
        duration: 340,
        coverUrl: albumMap['Classical Bliss'].coverUrl,
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2015-10-17'),
        playCount: 42100,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Teri Ore Soulful Medley',
        artist: artistMap['Shreya Ghoshal']._id,
        album: albumMap['Classical Bliss']._id,
        genre: 'Melody',
        duration: 339,
        coverUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
        releaseDate: new Date('2008-07-12'),
        playCount: 36700,
        isDemo: true,
        license: 'demo-placeholder'
      },
      {
        title: 'Govinda Krishna Jai Gopala',
        artist: artistMap['Shreya Ghoshal']._id,
        album: albumMap['Classical Bliss']._id,
        genre: 'Devotional',
        duration: 310,
        coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
        audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
        releaseDate: new Date('2021-09-01'),
        playCount: 28900,
        isDemo: true,
        license: 'demo-placeholder'
      }
    ];

    const createdSongs = await Song.insertMany(demoSongs);

    // Update albums with their song IDs
    for (const album of createdAlbums) {
      const albumSongs = createdSongs.filter((s) => s.album.toString() === album._id.toString());
      album.songs = albumSongs.map((s) => s._id);
      await album.save();
    }

    console.log(`🎉 Demo seeding completed successfully!`);
    console.log(`   - Artists created: ${createdArtists.length}`);
    console.log(`   - Albums created: ${createdAlbums.length}`);
    console.log(`   - Songs created: ${createdSongs.length}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
