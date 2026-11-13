import { Router } from 'express';
import { getLikedSongs, likeSong, unlikeSong } from '../controllers/likeController.js';
import { authMiddleware, requireDbUser } from '../middleware/authMiddleware.js';
import { validate, validateMongoIdParam } from '../middleware/validationMiddleware.js';

const router = Router();

// All like routes require authentication
router.use(authMiddleware, requireDbUser);

// GET /api/users/likes - Get user's liked songs
router.get('/', getLikedSongs);

// POST /api/users/likes - Like a song via request body { songId }
router.post('/', likeSong);

// POST /api/users/likes/:songId - Like a song by ID
router.post('/:songId', validate(validateMongoIdParam('songId')), likeSong);

// DELETE /api/users/likes/:songId - Unlike a song by ID
router.delete('/:songId', validate(validateMongoIdParam('songId')), unlikeSong);

export default router;
