import { Router } from 'express';
import { addToHistory, getHistory } from '../controllers/historyController.js';
import { authMiddleware, requireDbUser } from '../middleware/authMiddleware.js';
import { validate, validateMongoIdParam, validatePagination } from '../middleware/validationMiddleware.js';

const router = Router();

// All history routes require authentication
router.use(authMiddleware, requireDbUser);

// GET /api/users/history - Get listening history
router.get('/', validate(validatePagination), getHistory);

// POST /api/users/history - Record song play via body { songId }
router.post('/', addToHistory);

// POST /api/users/history/:songId - Record song play by songId param
router.post('/:songId', validate(validateMongoIdParam('songId')), addToHistory);

export default router;
