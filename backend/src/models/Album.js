import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
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
    coverUrl: {
      type: String,
      default: ''
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
      }
    ],
    releaseDate: {
      type: Date,
      default: Date.now
    },
    genre: {
      type: String,
      default: 'Pop',
      trim: true
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

albumSchema.index({ title: 'text' });

const Album = mongoose.model('Album', albumSchema);
export default Album;
