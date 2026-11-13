import ListeningHistory from '../models/ListeningHistory.js';
import Song from '../models/Song.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Record a song play into user listening history and increment song playCount
 * POST /api/users/history
 */
export const addToHistory = async (req, res, next) => {
  try {
    const songId = req.body.songId || req.params.songId;
    const userId = req.user._id;

    if (!songId) {
      return errorResponse(res, 'songId is required', 400);
    }

    // Verify song exists and increment playCount
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!updatedSong) {
      return errorResponse(res, 'Song not found', 404);
    }

    // Record listening event
    const historyEntry = await ListeningHistory.create({
      user: userId,
      song: songId,
      playedAt: new Date()
    });

    return successResponse(
      res,
      {
        historyEntry,
        playCount: updatedSong.playCount
      },
      'Song added to history and play count incremented',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user listening history
 * GET /api/users/history
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      ListeningHistory.find({ user: userId })
        .populate({
          path: 'song',
          populate: [
            { path: 'artist', select: 'name image bio verified' },
            { path: 'album', select: 'title coverUrl releaseDate' }
          ]
        })
        .sort({ playedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ListeningHistory.countDocuments({ user: userId })
    ]);

    // Filter out entries where song might have been removed
    const validHistory = history.filter((item) => item.song != null);

    return successResponse(
      res,
      {
        history: validHistory,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      },
      'Listening history retrieved successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};
