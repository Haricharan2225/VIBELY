import { Router } from 'express';

import mongoose from 'mongoose';
import firebaseAdmin from '../config/firebase.js';

const router = Router();

// GET /api/health - Comprehensive Health Check
router.get('/', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const firebaseStatus = firebaseAdmin && !firebaseAdmin._isStub ? 'configured' : 'stub_mode';

  return res.status(200).json({
    status: 'ok',
    service: 'VIBELY Music Streaming API',
    tagline: 'Feel Every Vibe.',
    database: dbStatus,
    auth: firebaseStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    uptimeFormatted: `${Math.floor(process.uptime())}s`,
  });
});

export default router;
