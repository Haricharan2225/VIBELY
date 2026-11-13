import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { PAGINATION } from '../utils/constants.js';

/**
 * Get all songs with pagination
 * GET /api/songs
 */
export const getAllSongs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    const [songs, total] = await Promise.all([
      Song.find()
        .populate('artist', 'name image bio verified')
        .populate('album', 'title coverUrl releaseDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Song.countDocuments()
    ]);

    return successResponse(
      res,
      {
        songs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      'Songs retrieved successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get single song by ID
 * GET /api/songs/:id
 */
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id)
      .populate('artist', 'name image bio verified genres')
      .populate('album', 'title coverUrl releaseDate genre')
      .lean();

    if (!song) {
      return errorResponse(res, 'Song not found', 404);
    }

    return successResponse(res, song, 'Song retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Search songs by title, artist name, or genre
 * GET /api/songs/search?q=query
 */
export const searchSongs = async (req, res, next) => {
  try {
    const queryStr = (req.query.q || '').trim();

    if (!queryStr) {
      return errorResponse(res, 'Search query cannot be empty', 400);
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    // Search for matching artists first
    const regex = new RegExp(queryStr, 'i');
    const matchingArtists = await Artist.find({ name: regex }).select('_id');
    const artistIds = matchingArtists.map((a) => a._id);

    // Build filter
    const filter = {
      $or: [
        { title: regex },
        { genre: regex },
        { artist: { $in: artistIds } }
      ]
    };

    const [songs, total] = await Promise.all([
      Song.find(filter)
        .populate('artist', 'name image bio verified')
        .populate('album', 'title coverUrl releaseDate')
        .sort({ playCount: -1, releaseDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Song.countDocuments(filter)
    ]);

    return successResponse(
      res,
      {
        query: queryStr,
        songs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      'Search results retrieved successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get songs by genre
 * GET /api/songs/genre/:genre
 */
export const getSongsByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const page = Math.max(1, parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(req.query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
    );
    const skip = (page - 1) * limit;

    const filter = { genre: new RegExp(`^${genre.trim()}$`, 'i') };

    const [songs, total] = await Promise.all([
      Song.find(filter)
        .populate('artist', 'name image bio verified')
        .populate('album', 'title coverUrl releaseDate')
        .sort({ playCount: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Song.countDocuments(filter)
    ]);

    return successResponse(
      res,
      {
        genre,
        songs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      `Songs for genre '${genre}' retrieved successfully`,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get new releases (latest songs)
 * GET /api/songs/new-releases
 */
export const getNewReleases = async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const songs = await Song.find()
      .populate('artist', 'name image bio verified')
      .populate('album', 'title coverUrl releaseDate')
      .sort({ releaseDate: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(res, songs, 'New releases retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular songs (most played)
 * GET /api/songs/popular
 */
export const getPopularSongs = async (req, res, next) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const songs = await Song.find()
      .populate('artist', 'name image bio verified')
      .populate('album', 'title coverUrl releaseDate')
      .sort({ playCount: -1, releaseDate: -1 })
      .limit(limit)
      .lean();

    return successResponse(res, songs, 'Popular songs retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};
