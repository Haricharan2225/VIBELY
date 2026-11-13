import Like from '../models/Like.js';
import Song from '../models/Song.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Like a song (prevents duplicates)
 * POST /api/users/likes/:songId or POST /api/users/likes
 */
export const likeSong = async (req, res, next) => {
  try {
    const songId = req.params.songId || req.body.songId;
    const userId = req.user._id;

    if (!songId) {
      return errorResponse(res, 'songId is required', 400);
    }

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return errorResponse(res, 'Song not found', 404);
    }

    // Check if already liked
    const existingLike = await Like.findOne({ user: userId, song: songId });
    if (existingLike) {
      return successResponse(res, existingLike, 'Song is already liked', 200);
    }

    const newLike = await Like.create({
      user: userId,
      song: songId
    });

    return successResponse(res, newLike, 'Song liked successfully', 201);
  } catch (error) {
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      const existingLike = await Like.findOne({
        user: req.user._id,
        song: req.params.songId || req.body.songId
      });
      return successResponse(res, existingLike, 'Song is already liked', 200);
    }
    next(error);
  }
};

/**
 * Unlike a song
 * DELETE /api/users/likes/:songId
 */
export const unlikeSong = async (req, res, next) => {
  try {
    const songId = req.params.songId || req.body.songId;
    const userId = req.user._id;

    if (!songId) {
      return errorResponse(res, 'songId is required', 400);
    }

    const deleted = await Like.findOneAndDelete({ user: userId, song: songId });

    if (!deleted) {
      return errorResponse(res, 'Like not found or already removed', 404);
    }

    return successResponse(res, { songId }, 'Song unliked successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all songs liked by current user
 * GET /api/users/likes
 */
export const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const likes = await Like.find({ user: userId })
      .populate({
        path: 'song',
        populate: [
          { path: 'artist', select: 'name image bio verified' },
          { path: 'album', select: 'title coverUrl releaseDate' }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

    // Extract valid songs (in case a referenced song was deleted)
    const songs = likes
      .filter((like) => like.song)
      .map((like) => ({
        ...like.song,
        likedAt: like.createdAt
      }));

    return successResponse(res, songs, 'Liked songs retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
