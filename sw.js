/*
  Service worker per LEVI PWA
  Conserva le risorse essenziali nella cache e fornisce funzionalità offline di base.
*/

// incrementa il nome della cache per forzare l'aggiornamento dopo modifiche
const CACHE_NAME = 'levi-cache-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
  , './icons/icon-180.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => {
      if (key !== CACHE_NAME) {
        return caches.delete(key);
      }
    })))
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  // bypass non-GET requests
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).catch(() => {
        // offline fallback: se non disponibile, ritorna index.html per navigazioni interne
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});