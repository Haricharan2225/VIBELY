import { Router } from 'express';
import {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlistController.js';
import { authMiddleware, requireDbUser } from '../middleware/authMiddleware.js';
import {
  validate,
  validateCreatePlaylist,
  validateUpdatePlaylist,
  validateAddRemoveSong,
  validateMongoIdParam
} from '../middleware/validationMiddleware.js';

const router = Router();

// All playlist routes require authentication and database user
router.use(authMiddleware, requireDbUser);

// GET /api/playlists - Get playlists
router.get('/', getUserPlaylists);

// GET /api/playlists/:id - Get playlist by ID
router.get('/:id', validate(validateMongoIdParam('id')), getPlaylistById);

// POST /api/playlists - Create new playlist
router.post('/', validate(validateCreatePlaylist), createPlaylist);

// PUT /api/playlists/:id - Update playlist
router.put('/:id', validate(validateUpdatePlaylist), updatePlaylist);

// DELETE /api/playlists/:id - Delete playlist
router.delete('/:id', validate(validateMongoIdParam('id')), deletePlaylist);

// POST /api/playlists/:id/songs - Add song to playlist
router.post('/:id/songs', validate(validateAddRemoveSong), addSongToPlaylist);

// DELETE /api/playlists/:id/songs/:songId - Remove song from playlist
router.delete(
  '/:id/songs/:songId',
  validate([...validateMongoIdParam('id'), ...validateMongoIdParam('songId')]),
  removeSongFromPlaylist
);

export default router;
