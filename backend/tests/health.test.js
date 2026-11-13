import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health Check Endpoints', () => {
  it('GET /api/health returns 200 with status ok, timestamp, and uptime', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('GET / returns 200 with root API metadata', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Vibely Music Streaming API');
    expect(res.body).toHaveProperty('status', 'online');
    expect(res.body).toHaveProperty('version', '1.0.0');
  });
});
