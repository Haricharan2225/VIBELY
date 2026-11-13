import { Router } from 'express';
import {
  getAllSongs,
  getSongById,
  searchSongs,
  getSongsByGenre,
  getNewReleases,
  getPopularSongs
} from '../controllers/songController.js';
import {
  validate,
  validatePagination,
  validateSearchQuery,
  validateMongoIdParam
} from '../middleware/validationMiddleware.js';

const router = Router();

// GET /api/songs/new-releases - Get recent songs
router.get('/new-releases', getNewReleases);

// GET /api/songs/popular - Get top played songs
router.get('/popular', getPopularSongs);

// GET /api/songs/search?q=query - Search songs
router.get('/search', validate(validateSearchQuery), searchSongs);

// GET /api/songs/genre/:genre - Get songs by genre
router.get('/genre/:genre', validate(validatePagination), getSongsByGenre);

// GET /api/songs - Get all songs with pagination
router.get('/', validate(validatePagination), getAllSongs);

// GET /api/songs/:id - Get single song by ID
router.get('/:id', validate(validateMongoIdParam('id')), getSongById);

export default router;
