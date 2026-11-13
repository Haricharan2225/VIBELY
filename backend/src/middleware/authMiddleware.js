import firebaseAdmin from '../config/firebase.js';
import User from '../models/User.js';

/**
 * Middleware to authenticate requests using Firebase ID token
 * Verifies token, fetches or prepares user info, and attaches to req.user
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided in Authorization header.'
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Bearer token is empty.'
      });
    }

    // Verify token with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    } catch (firebaseErr) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase ID token.',
        error: process.env.NODE_ENV === 'development' ? firebaseErr.message : undefined
      });
    }

    req.firebaseUser = decodedToken;

    // Find corresponding user in MongoDB
    const mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });

    if (mongoUser) {
      req.user = mongoUser;
    } else {
      // For session creation or new user provisioning
      req.user = {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || null,
        phoneNumber: decodedToken.phone_number || null,
        displayName: decodedToken.name || 'Music Lover',
        profileImage: decodedToken.picture || '',
        provider: decodedToken.firebase?.sign_in_provider === 'phone'
          ? 'phone'
          : decodedToken.firebase?.sign_in_provider === 'google.com'
          ? 'google'
          : 'email'
      };
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional authentication middleware - does not block if token is missing
 */
export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1].trim();
      if (token) {
        try {
          const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
          req.firebaseUser = decodedToken;
          const mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
          if (mongoUser) {
            req.user = mongoUser;
          }
        } catch {
          // Token invalid, proceed as guest
          req.user = null;
        }
      }
    }
    next();
  } catch {
    next();
  }
};

/**
 * Middleware ensuring MongoDB user exists for routes that require database operations
 */
export const requireDbUser = (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: 'User profile not found. Please establish a session first.'
    });
  }
  next();
};

export default authMiddleware;
