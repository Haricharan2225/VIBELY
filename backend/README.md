# VIBELY Backend API

High-performance, modular REST API for the VIBELY music streaming application built with Node.js, Express, MongoDB Atlas, and Firebase Authentication.

---

## 🌟 Tech Stack

- **Runtime & Framework**: Node.js (ES Modules) + Express.js
- **Database & ODM**: MongoDB Atlas + Mongoose
- **Authentication**: Firebase Admin SDK (ID Token verification)
- **Security**: Helmet, CORS, Express Rate Limit
- **Validation**: Express-Validator
- **Testing**: Vitest + Supertest

---

## 📁 Project Structure

```
d:\Vibely\backend\
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── src/
│   ├── app.js                      # Express application setup & middleware
│   ├── server.js                   # Server initialization & graceful shutdown
│   ├── config/
│   │   ├── db.js                   # MongoDB connection logic
│   │   └── firebase.js             # Firebase Admin SDK initialization
│   ├── controllers/
│   │   ├── authController.js       # Session, Me, Logout
│   │   ├── songController.js       # Song queries, search, genres, popular
│   │   ├── playlistController.js   # Playlist CRUD & song management
│   │   ├── likeController.js       # User song likes
│   │   ├── historyController.js    # Listening history & play counter
│   │   └── userController.js       # Profile management
│   ├── middleware/
│   │   ├── authMiddleware.js       # Firebase token verification & DB lookup
│   │   ├── errorMiddleware.js      # Central error & 404 handler
│   │   └── validationMiddleware.js # Express-validator rules
│   ├── models/
│   │   ├── User.js                 # Firebase UID, preferences, theme
│   │   ├── Song.js                 # Song metadata, audio URL, play counts
│   │   ├── Artist.js               # Artist metadata, bio, genres
│   │   ├── Album.js                # Album metadata & song associations
│   │   ├── Playlist.js             # User playlists
│   │   ├── ListeningHistory.js     # User listening records
│   │   └── Like.js                 # Compound unique song likes
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── songRoutes.js           # /api/songs
│   │   ├── playlistRoutes.js       # /api/playlists
│   │   ├── likeRoutes.js           # /api/users/likes
│   │   ├── historyRoutes.js        # /api/users/history
│   │   ├── userRoutes.js           # /api/users
│   │   └── healthRoutes.js         # /api/health
│   ├── services/
│   │   ├── firebaseAuthService.js  # Firebase auth helpers
│   │   └── recommendationService.js# Music recommendation engine
│   ├── seed/
│   │   └── seedData.js             # Demo data seeder (Telugu, Hindi, English)
│   └── utils/
│       ├── apiResponse.js          # Standardized response format
│       └── constants.js            # Genres, pagination defaults
└── tests/
    ├── auth.test.js                # Auth security & token verification tests
    ├── health.test.js              # Server health & uptime tests
    └── songs.test.js               # Song query & validation tests
```

---

## 🚀 Setup & Getting Started

### 1. Install Dependencies
```bash
cd d:\Vibely\backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your MongoDB and Firebase Admin credentials:
```bash
cp .env.example .env
```

Environment variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: `development` | `production` | `test`
- `MONGODB_URI`: MongoDB connection string
- `CLIENT_URL`: Allowed frontend origin (e.g. `http://localhost:5173`)
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Firebase service account client email
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key

### 3. Seed Demo Data
Populate the database with sample artists, albums, and songs:
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Run Tests
```bash
npm test
```

---

## 📡 API Reference

### Health
- `GET /api/health` - Check server health, uptime, and timestamp

### Authentication
- `POST /api/auth/session` - Create or restore user session from Firebase ID token (`Bearer <token>`)
- `GET /api/auth/me` - Get current user profile (Auth required)
- `POST /api/auth/logout` - Logout (Auth required)

### Songs
- `GET /api/songs` - Get paginated songs (`?page=1&limit=20`)
- `GET /api/songs/new-releases` - Get newest releases
- `GET /api/songs/popular` - Get most played songs
- `GET /api/songs/search?q=query` - Search songs by title, artist, or genre
- `GET /api/songs/genre/:genre` - Get songs by genre
- `GET /api/songs/:id` - Get single song details

### Playlists
- `GET /api/playlists` - Get user's playlists and public playlists (Auth required)
- `GET /api/playlists/:id` - Get playlist by ID
- `POST /api/playlists` - Create new playlist (Auth required)
- `PUT /api/playlists/:id` - Update playlist (Owner only)
- `DELETE /api/playlists/:id` - Delete playlist (Owner only)
- `POST /api/playlists/:id/songs` - Add song to playlist (Owner only)
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist (Owner only)

### User Likes
- `GET /api/users/likes` - Get current user's liked songs (Auth required)
- `POST /api/users/likes/:songId` - Like a song (Auth required)
- `DELETE /api/users/likes/:songId` - Unlike a song (Auth required)

### User History
- `GET /api/users/history` - Get listening history (Auth required)
- `POST /api/users/history` - Record song playback & increment play count (Auth required)

### User Profile
- `GET /api/users/me` - Get profile (Auth required)
- `PUT /api/users/me` - Update display name, profile image, theme, favorite genres (Auth required)
