import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get user profile
 * GET /api/users/profile or GET /api/users/me
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).lean();

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'Profile retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/users/profile or PUT /api/users/me
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { displayName, profileImage, preferences } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (displayName !== undefined) {
      user.displayName = displayName.trim();
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    if (preferences) {
      if (Array.isArray(preferences.favoriteGenres)) {
        user.preferences.favoriteGenres = preferences.favoriteGenres;
      }
      if (preferences.theme && ['dark', 'light'].includes(preferences.theme)) {
        user.preferences.theme = preferences.theme;
      }
    }

    user.updatedAt = new Date();
    await user.save();

    return successResponse(res, user, 'Profile updated successfully', 200);
  } catch (error) {
    next(error);
  }
};
