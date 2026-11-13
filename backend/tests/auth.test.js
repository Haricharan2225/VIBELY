import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Auth Middleware & Route Security', () => {
  it('GET /api/auth/me returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/no token provided/i);
  });

  it('POST /api/auth/session returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/no token provided/i);
  });

  it('POST /api/auth/logout returns 401 when no token is provided', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me returns 401 with malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid_malformed_token');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
