/**
 * CropShield AI - Offline Service Worker
 * Ensures the entire application loads and functions for farmers
 * even when the server is off, disconnected, or offline.
 */

const CACHE_NAME = 'cropshield-ai-v3';
const PRECACHE_ASSETS = [];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});


// Activate Event: Clean up older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[CropShield PWA] Removing outdated cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch Event: Network-First with Cache Fallback for navigation, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests or backend ML uploads
  if (request.method !== 'GET' || url.pathname.startsWith('/predict') || url.pathname.startsWith('/api/')) {
    return;
  }

  // Handle SPA Page Navigation (e.g. /weather, /dashboard, /diagnose)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the updated index page
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          console.log('[CropShield PWA] Offline navigation fallback for:', request.url);
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Static Assets: Cache-First with Background Revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache immediately, optionally fetch update in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {}); // Ignore network errors when offline
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting an image, return SVG fallback
          if (request.headers.get('accept')?.includes('image/')) {
            return caches.match('/favicon.svg');
          }
        });
    })
  );
});
