import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Song from '../src/models/Song.js';

describe('Song Endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/songs returns 200 with song list and pagination', async () => {
    const mockSongs = [
      {
        _id: '60c72b2f9b1d8b2badbee001',
        title: 'Samajavaragamana',
        genre: 'Tollywood',
        duration: 214,
        playCount: 15420,
        artist: {
          _id: '60c72b2f9b1d8b2badbee002',
          name: 'Sid Sriram',
          verified: true
        },
        album: {
          _id: '60c72b2f9b1d8b2badbee003',
          title: 'Samajavaragamana Special'
        }
      }
    ];

    vi.spyOn(Song, 'find').mockReturnValue({
      populate: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue(mockSongs)
    });

    vi.spyOn(Song, 'countDocuments').mockResolvedValue(1);

    const res = await request(app).get('/api/songs?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.songs).toHaveLength(1);
    expect(res.body.data.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1
    });
  });

  it('GET /api/songs/search returns 400 when query parameter q is missing', async () => {
    const res = await request(app).get('/api/songs/search');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/songs/:id returns 400 when ID format is not a valid ObjectId', async () => {
    const res = await request(app).get('/api/songs/invalid-mongo-id');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
