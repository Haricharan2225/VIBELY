import { validationResult, body, param, query } from 'express-validator';
import mongoose from 'mongoose';

/**
 * Runner middleware that executes express-validator chains and sends 400 on error
 * @param {Array} validations
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  };
};

/**
 * Helper to validate MongoDB ObjectId
 */
export const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Common validation chains
export const validateMongoIdParam = (paramName = 'id') => [
  param(paramName)
    .trim()
    .notEmpty().withMessage(`${paramName} is required`)
    .custom((val) => isValidObjectId(val)).withMessage(`Invalid ${paramName} format`)
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be an integer >= 1')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    .toInt()
];

export const validateSearchQuery = [
  query('q')
    .trim()
    .notEmpty().withMessage('Search query "q" is required and cannot be empty')
    .isLength({ min: 1, max: 100 }).withMessage('Search query length must be between 1 and 100 characters')
];

export const validateCreatePlaylist = [
  body('name')
    .trim()
    .notEmpty().withMessage('Playlist name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Playlist name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('coverUrl')
    .optional()
    .trim()
    .isString(),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

export const validateUpdatePlaylist = [
  param('id')
    .custom((val) => isValidObjectId(val)).withMessage('Invalid playlist ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Playlist name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('coverUrl')
    .optional()
    .trim()
    .isString(),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic must be a boolean')
];

export const validateAddRemoveSong = [
  param('id')
    .custom((val) => isValidObjectId(val)).withMessage('Invalid playlist ID format'),
  body('songId')
    .trim()
    .notEmpty().withMessage('songId is required')
    .custom((val) => isValidObjectId(val)).withMessage('Invalid song ID format')
];

export const validateUpdateProfile = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage('Display name must be between 1 and 50 characters'),
  body('profileImage')
    .optional()
    .trim()
    .isString(),
  body('preferences')
    .optional()
    .isObject().withMessage('Preferences must be an object'),
  body('preferences.favoriteGenres')
    .optional()
    .isArray().withMessage('favoriteGenres must be an array of strings'),
  body('preferences.theme')
    .optional()
    .isIn(['dark', 'light']).withMessage('theme must be either "dark" or "light"')
];
