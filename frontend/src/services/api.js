import axios from 'axios';
import { auth } from './firebase';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach Firebase ID Token
api.interceptors.request.use(
  async (config) => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.warn('Error attaching Firebase token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request, user token might be expired.');
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const musicApi = {
  getFeatured: () => api.get('/api/music/featured'),
  getTrending: () => api.get('/api/music/trending'),
  getNewReleases: () => api.get('/api/music/new-releases'),
  getSongById: (id) => api.get(`/api/music/songs/${id}`),
  getByGenre: (genre) => api.get(`/api/music/genre/${genre}`),
  search: (query, type) => api.get('/api/music/search', { params: { q: query, type } }),
  getLikedSongs: () => api.get('/api/music/liked'),
  toggleLikeSong: (songId) => api.post(`/api/music/liked/${songId}`),
  getPlaylists: () => api.get('/api/playlists'),
  getPlaylistById: (id) => api.get(`/api/playlists/${id}`),
  createPlaylist: (data) => api.post('/api/playlists', data),
  addSongToPlaylist: (playlistId, songId) => api.post(`/api/playlists/${playlistId}/songs`, { songId }),
  getArtistById: (id) => api.get(`/api/artists/${id}`),
  getAlbumById: (id) => api.get(`/api/albums/${id}`),
  getHistory: () => api.get('/api/music/history'),
  recordPlay: (songId) => api.post(`/api/music/play/${songId}`),
};

export const togetherApi = {
  createRoom: (roomData) => api.post('/api/together/rooms', roomData),
  getRoom: (roomId) => api.get(`/api/together/rooms/${roomId}`),
  joinRoom: (roomId, code) => api.post(`/api/together/rooms/${roomId}/join`, { code }),
  syncState: (roomId, state) => api.post(`/api/together/rooms/${roomId}/sync`, state),
};

export default api;
