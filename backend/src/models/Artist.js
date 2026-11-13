import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    image: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      trim: true
    },
    genres: [
      {
        type: String,
        trim: true
      }
    ],
    verified: {
      type: Boolean,
      default: false
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

artistSchema.index({ name: 'text', bio: 'text' });

const Artist = mongoose.model('Artist', artistSchema);
export default Artist;
