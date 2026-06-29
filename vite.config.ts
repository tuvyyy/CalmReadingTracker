import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png', 'favicon.svg'],
      manifest: {
        name: 'Water Spirit Reading',
        short_name: 'Water Spirit',
        description: 'TOEIC Reading Tracker – Làm bài, chấm điểm, ôn câu sai, học từ vựng.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#071014',
        background_color: '#071014',
        icons: [
          {
            src: '/icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        importScripts: ['notification-sw.js'],

        // Pre-cache all built assets (JS, CSS, HTML)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Runtime caching for Google Fonts
        runtimeCaching: [
          {
            // Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            // Google Fonts webfont files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },

      // Dev options – enable PWA in dev mode for testing
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
