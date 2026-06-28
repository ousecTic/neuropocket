import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

// `--mode offline` produces a single self-contained index.html that runs straight
// from the filesystem (file://): JS/CSS inlined and the model embedded in-memory.
// All other modes keep the normal multi-file PWA build untouched.
// Strips head links that only make failed network requests over file:// (external
// Google Fonts and absolute-path PWA icons), so the offline build's console is clean.
const stripOnlineOnlyHeadLinks = () => ({
  name: 'strip-online-only-head-links',
  transformIndexHtml(html: string) {
    return html
      .replace(/\s*<link rel="preconnect"[^>]*>/g, '')
      .replace(/\s*<link[^>]*fonts\.googleapis\.com[^>]*>/g, '')
      .replace(/\s*<link rel="icon"[^>]*>/g, '')
      .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, '')
      .replace(/\s*<link rel="mask-icon"[^>]*>/g, '');
  },
});

export default defineConfig(({ mode }) => {
  const offline = mode === 'offline';

  return {
  base: './',
  // Inline as a literal so the offline-only code paths (embedded model + challenge
  // images) are dead-code-eliminated from the normal build.
  define: { 'import.meta.env.VITE_OFFLINE_BUILD': offline ? 'true' : 'false' },
  // The offline build omits VitePWA, so stub its virtual module (no service worker
  // over file://).
  resolve: offline
    ? {
        alias: {
          'virtual:pwa-register': fileURLToPath(
            new URL('./src/offline/pwa-register-stub.ts', import.meta.url)
          ),
        },
      }
    : {},
  plugins: [
    react(),
    ...(offline ? [stripOnlineOnlyHeadLinks(), viteSingleFile()] : []),
    ...(offline ? [] : [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'mask-icon.svg', 
        'model/model.json', 
        'model/group1-shard1of2.bin', 
        'model/group1-shard2of2.bin',
        'offline-demo.png'
      ],
      manifest: {
        name: 'NeuroPocket',
        short_name: 'NeuroPocket',
        description: 'Train and use AI models anywhere - works completely offline',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,json,bin}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'gstatic-fonts-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })])
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  build: {
    outDir: offline ? 'dist-offline' : 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'es2018'
  }
  };
});