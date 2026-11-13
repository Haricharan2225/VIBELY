import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      sparse: true,
      index: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      sparse: true,
      trim: true
    },
    displayName: {
      type: String,
      default: 'Music Lover',
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    provider: {
      type: String,
      enum: ['phone', 'google', 'email'],
      required: true
    },
    linkedProviders: [
      {
        type: String
      }
    ],
    preferences: {
      favoriteGenres: [
        {
          type: String
        }
      ],
      theme: {
        type: String,
        default: 'dark',
        enum: ['dark', 'light']
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
export default User;
