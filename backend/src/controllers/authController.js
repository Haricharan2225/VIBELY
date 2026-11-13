import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Establish or restore user session from Firebase token
 * POST /api/auth/session
 */
export const createSession = async (req, res, next) => {
  try {
    const firebaseUser = req.firebaseUser;

    if (!firebaseUser || !firebaseUser.uid) {
      return errorResponse(res, 'Invalid authentication payload', 400);
    }

    const { uid, email, phone_number, name, picture, firebase } = firebaseUser;
    const signInProvider = firebase?.sign_in_provider;

    let provider = 'email';
    if (signInProvider === 'phone') {
      provider = 'phone';
    } else if (signInProvider === 'google.com') {
      provider = 'google';
    }

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Determine default display name
      const defaultName = name || (phone_number ? `User ${phone_number.slice(-4)}` : 'Music Lover');

      user = await User.create({
        firebaseUid: uid,
        email: email || undefined,
        phoneNumber: phone_number || undefined,
        displayName: req.body?.displayName || defaultName,
        profileImage: req.body?.profileImage || picture || '',
        provider,
        linkedProviders: [provider],
        preferences: {
          favoriteGenres: req.body?.preferences?.favoriteGenres || [],
          theme: req.body?.preferences?.theme || 'dark'
        }
      });
    } else {
      // Update missing fields if available in claims
      let hasChanges = false;

      if (!user.email && email) {
        user.email = email;
        hasChanges = true;
      }
      if (!user.phoneNumber && phone_number) {
        user.phoneNumber = phone_number;
        hasChanges = true;
      }
      if ((!user.displayName || user.displayName === 'Music Lover') && name) {
        user.displayName = name;
        hasChanges = true;
      }
      if (!user.profileImage && picture) {
        user.profileImage = picture;
        hasChanges = true;
      }
      if (provider && !user.linkedProviders.includes(provider)) {
        user.linkedProviders.push(provider);
        hasChanges = true;
      }

      if (hasChanges) {
        user.updatedAt = new Date();
        await user.save();
      }
    }

    return successResponse(res, user, 'Session established successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const firebaseUid = req.firebaseUser?.uid;

    if (!firebaseUid) {
      return errorResponse(res, 'Authentication token missing or invalid', 401);
    }

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return errorResponse(res, 'User profile not found in database', 404);
    }

    return successResponse(res, user, 'Current user retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

/**
 * User logout endpoint
 * POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    return successResponse(res, null, 'Logged out successfully', 200);
  } catch (error) {
    next(error);
  }
};
