import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
      index: true
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      index: true
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    duration: {
      type: Number,
      default: 0
    },
    coverUrl: {
      type: String,
      default: ''
    },
    audioUrl: {
      type: String,
      default: ''
    },
    releaseDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    playCount: {
      type: Number,
      default: 0,
      index: true
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true
    },
    license: {
      type: String,
      default: 'standard'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

songSchema.index({ title: 'text' });

const Song = mongoose.model('Song', songSchema);
export default Song;
