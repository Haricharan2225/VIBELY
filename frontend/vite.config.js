import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'VIBELY — Feel Every Vibe',
        short_name: 'VIBELY',
        description: 'Modern, premium full-stack music streaming web application',
        theme_color: '#0B0B0C',
        background_color: '#0B0B0C',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'https://res.cloudinary.com/dnuzyfts7/image/upload/v1794515256/file_00000000a3a88208bffe4108518ed171_kt97fj.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://res.cloudinary.com/dnuzyfts7/image/upload/v1794515256/file_00000000a3a88208bffe4108518ed171_kt97fj.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://res.cloudinary.com',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'vibely-brand-assets',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
  },
});
