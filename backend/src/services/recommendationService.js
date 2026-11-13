import Song from '../models/Song.js';
import ListeningHistory from '../models/ListeningHistory.js';
import User from '../models/User.js';

/**
 * Get personalized recommendations for a user based on listening history & preferences
 * @param {string} userId
 * @param {number} limit
 */
export const getRecommendationsForUser = async (userId, limit = 10) => {
  const user = await User.findById(userId).lean();
  const favoriteGenres = user?.preferences?.favoriteGenres || [];

  // Get recently listened songs to avoid immediate re-recommending
  const recentHistory = await ListeningHistory.find({ user: userId })
    .sort({ playedAt: -1 })
    .limit(20)
    .select('song')
    .lean();

  const recentSongIds = recentHistory.map((h) => h.song);

  const query = {
    _id: { $nin: recentSongIds }
  };

  if (favoriteGenres.length > 0) {
    query.genre = { $in: favoriteGenres };
  }

  let recommendations = await Song.find(query)
    .populate('artist', 'name image bio verified')
    .populate('album', 'title coverUrl releaseDate')
    .sort({ playCount: -1 })
    .limit(limit)
    .lean();

  // If not enough songs found from favorite genres, fill with popular songs
  if (recommendations.length < limit) {
    const fallbackSongs = await Song.find({
      _id: { $nin: [...recentSongIds, ...recommendations.map((r) => r._id)] }
    })
      .populate('artist', 'name image bio verified')
      .populate('album', 'title coverUrl releaseDate')
      .sort({ playCount: -1 })
      .limit(limit - recommendations.length)
      .lean();

    recommendations = [...recommendations, ...fallbackSongs];
  }

  return recommendations;
};

export default {
  getRecommendationsForUser
};
