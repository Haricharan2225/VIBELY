import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';

// Layouts and Protection
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import GenrePage from './pages/GenrePage';
import SongDetailPage from './pages/SongDetailPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import LibraryPage from './pages/LibraryPage';
import LikedSongsPage from './pages/LikedSongsPage';
import PlaylistPage from './pages/PlaylistPage';
import ProfilePage from './pages/ProfilePage';
import TogetherModePage from './pages/TogetherModePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PlayerProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<SplashPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Authenticated Routes with MainLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/home" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/genre/:genreName" element={<GenrePage />} />
                <Route path="/song/:id" element={<SongDetailPage />} />
                <Route path="/album/:id" element={<AlbumDetailPage />} />
                <Route path="/artist/:id" element={<ArtistDetailPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/liked" element={<LikedSongsPage />} />
                <Route path="/playlist/:id" element={<PlaylistPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/together" element={<TogetherModePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </PlayerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
