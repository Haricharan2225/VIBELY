import { Router } from 'express';
import { authMiddleware, requireDbUser } from '../middleware/authMiddleware.js';
import { createSession, getMe, logout } from '../controllers/authController.js';

const router = Router();

// POST /api/auth/session - Verify Firebase token and create/restore user session
router.post('/session', authMiddleware, createSession);

// GET /api/auth/me - Get current user profile from DB
router.get('/me', authMiddleware, requireDbUser, getMe);

// POST /api/auth/logout - Logout user
router.post('/logout', authMiddleware, logout);

export default router;
