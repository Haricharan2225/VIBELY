# 🎵 VIBELY — Feel Every Vibe

A modern, premium, full-stack music streaming web application.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + Vite + JavaScript + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **Authentication** | Firebase (Phone OTP + Google Sign-in) |
| **Icons** | Lucide React |

## Project Structure

```
vibely/
  frontend/          # React + Vite application
  backend/           # Express.js API server
  README.md
  .gitignore
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB Atlas account
- Firebase project with Phone & Google auth enabled

### Frontend

```bash
cd frontend
cp .env.example .env    # Fill in your values
npm install
npm run dev
```

### Backend

```bash
cd backend
cp .env.example .env    # Fill in your values
npm install
npm run dev
```

## Environment Variables

See `.env.example` files in `frontend/` and `backend/` directories.

> ⚠️ **Never commit `.env` files or Firebase service account keys.**

## Features

- 🎧 Full HTML5 music player with queue, shuffle, repeat
- 🔐 Firebase Phone OTP & Google Sign-in authentication
- 🔒 Persistent login — no re-auth on every visit
- 🎵 Song search, genres, playlists, liked songs
- 👥 Together Mode — synchronized listening rooms
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Two visual themes (Main + Together Mode)

## License

Private — Personal use only.
