import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authMiddleware, requireDbUser } from '../middleware/authMiddleware.js';
import { validate, validateUpdateProfile } from '../middleware/validationMiddleware.js';

const router = Router();

// All user routes require authentication and database user
router.use(authMiddleware, requireDbUser);

// GET /api/users/me, /api/users/profile, /api/users/ - Get profile
router.get('/me', getProfile);
router.get('/profile', getProfile);
router.get('/', getProfile);

// PUT /api/users/me, /api/users/profile, /api/users/ - Update profile
router.put('/me', validate(validateUpdateProfile), updateProfile);
router.put('/profile', validate(validateUpdateProfile), updateProfile);
router.put('/', validate(validateUpdateProfile), updateProfile);

export default router;
