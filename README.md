# 🎵 VIBELY — Feel Every Vibe.

A modern, high-performance, full-stack personal music streaming web application and Progressive Web App (PWA).

![VIBELY Brand Logo](https://res.cloudinary.com/dnuzyfts7/image/upload/v1794515278/vibely_logo_transparent_rswgie.png)

---

## 🌟 Overview & Highlights

VIBELY is crafted from the ground up to deliver a responsive, immersive music streaming experience across mobile, tablet, and desktop.

- 🔐 **Firebase Authentication**: Phone OTP + Google Sign-In with reCAPTCHA verification.
- 🔒 **Persistent Login**: Powered by Firebase `browserLocalPersistence` — zero login flickering, auto-session restoration on relaunch or PWA reopen.
- 🎧 **Native HTML5 Streaming Audio Engine**: Full persistent playback across navigation, queue manager, seek, volume, shuffle, repeat, mini-player, and expanded full-screen player view.
- 🎨 **Dual-Theme Design System**:
  - **Theme A (Main)**: Obsidian `#0B0B0C`, electric lime `#C6F432`, crisp white typography.
  - **Theme B (Together Mode)**: Deep navy `#14213D`, soft cream `#F4EDE0`, warm coral `#FF6B5B`.
- 👥 **Together Mode**: Shared listening rooms, live listener list, shared queue, and room-code badges.
- 🌙 **Sleep Timer**: 5m, 15m, 30m, 45m, 60m countdown with automatic playback stop.
- ✨ **AI Song Meaning & Context**: Multilingual thematic breakdowns (English, Telugu, Hindi, Tamil) with graceful AI provider configuration notices.
- 📱 **Progressive Web App (PWA)**: Standalone installable app with custom V-icon, offline caching, and service worker.
- 🛡️ **Zero Password Storage**: Fully outsourced to Firebase Auth & Admin SDK token verification on MongoDB Atlas.

---

## 🛠️ Technology Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, React Router v7, Lucide Icons, Vite PWA |
| **Backend** | Node.js (ESM), Express.js, Firebase Admin SDK, Mongoose |
| **Database** | MongoDB Atlas with compound indexes and pagination |
| **Auth** | Firebase Auth (Phone OTP, Google OAuth, LocalPersistence) |
| **Testing** | Vitest, Supertest |
| **Deployment** | Vercel (Frontend SPA) + Render (Backend Node API) |

---

## 📁 Repository Structure

```
vibely/
├── .gitignore                      # Security rules (never commits .env, keys, or logs)
├── README.md                       # Comprehensive documentation
├── backend/                        # Express API Server
│   ├── .env.example                # Backend environment template
│   ├── render.yaml                 # Render Blueprint configuration
│   ├── package.json
│   ├── src/
│   │   ├── app.js                  # Express application with Helmet & CORS
│   │   ├── server.js               # HTTP listener with graceful shutdown
│   │   ├── config/                 # db.js (MongoDB) & firebase.js (Admin SDK)
│   │   ├── controllers/            # auth, song, playlist, like, history, user
│   │   ├── middleware/             # authMiddleware, errorMiddleware, validation
│   │   ├── models/                 # User, Song, Artist, Album, Playlist, Like, History
│   │   ├── routes/                 # REST endpoints
│   │   ├── seed/                   # seedData.js (18 royalty-free demo tracks)
│   │   └── utils/                  # apiResponse, constants
│   └── tests/                      # health, auth, and song integration tests
└── frontend/                       # React 19 + Vite Application
    ├── .env.example                # Frontend environment template
    ├── vercel.json                 # Vercel SPA routing rewrites
    ├── package.json
    ├── vite.config.js              # Vite + Tailwind + VitePWA
    └── src/
        ├── App.jsx                 # Route definitions & Context wrappers
        ├── components/
        │   ├── auth/               # PhoneInput, OTPVerification, GoogleButton, ProtectedRoute, AuthLoadingScreen
        │   ├── common/             # Navbar, BottomNav, SongCard, PlaylistCard, GenreCard
        │   ├── layout/             # MainLayout, AuthLayout
        │   ├── music/              # MusicGrid, TrackList, SongMeaningModal
        │   ├── player/             # MiniPlayer, ExpandedPlayer, PlayerControls, ProgressBar, SleepTimerModal
        │   └── together/           # RoomCodeBadge, ParticipantsList
        ├── context/                # AuthContext, PlayerContext, ThemeContext
        ├── pages/                  # 17 complete interactive pages
        ├── services/               # firebase.js, api.js, authService.js
        └── utils/                  # brand.js (logos, themes, genres)
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Installed

### 2. Frontend Environment (`frontend/.env`)
Create `frontend/.env` based on `frontend/.env.example`:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 3. Backend Environment (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vibely?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 4. Running Locally

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and backend API at `http://localhost:5000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health status, uptime, and DB connection | No |
| `POST` | `/api/auth/session` | Verifies Firebase ID token & provisions/retrieves Mongo User | Yes (Bearer Token) |
| `GET` | `/api/auth/me` | Fetches authenticated user profile & preferences | Yes (Bearer Token) |
| `POST` | `/api/auth/logout` | Revokes token & clears server session state | Yes (Bearer Token) |
| `GET` | `/api/songs` | Paginated song catalogue | No |
| `GET` | `/api/songs/search?q=...` | Search tracks, artists, and genres | No |
| `GET` | `/api/songs/genre/:genre` | Filter songs by genre | No |
| `GET` | `/api/songs/:id` | Song details & playback metadata | No |
| `GET` | `/api/playlists` | User playlists | Yes |
| `POST` | `/api/playlists` | Create new playlist | Yes |
| `POST` | `/api/users/likes/:songId`| Add track to user's liked list | Yes |
| `DELETE`| `/api/users/likes/:songId`| Remove track from liked list | Yes |
| `GET` | `/api/users/history` | User listening history | Yes |

---

## 🧪 Testing

Run backend automated test suite:
```bash
cd backend
npm test
```

Build production frontend bundle and PWA service worker:
```bash
cd frontend
npm run build
```

---

## 🚢 Production Deployment

### Backend on Render
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository `vibely`.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Configure environment variables in the Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CLIENT_URL`: Your Vercel frontend URL
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_CLIENT_EMAIL`: Your Firebase service account email
   - `FIREBASE_PRIVATE_KEY`: Your Firebase service account private key (with escaped newlines)

### Frontend on Vercel
1. Import your GitHub repository `vibely` in [Vercel](https://vercel.com/).
2. Set **Root Directory**: `frontend`
3. Framework: **Vite**
4. Set Environment Variables:
   - `VITE_API_URL`: Your Render backend service URL (e.g., `https://vibely-api.onrender.com`)
   - `VITE_FIREBASE_API_KEY`: Your Firebase web API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: `your_project.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase web App ID
5. In Firebase Console, add your Vercel production domain to **Authentication → Settings → Authorized domains**.

---

## 📄 License & Content Safety

Private personal-use streaming platform. Demo audio tracks are royalty-free public domain tracks used strictly for architectural demonstration.
