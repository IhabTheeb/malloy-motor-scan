const CACHE_NAME = 'malloy-motor-scan-v1';
const OFFLINE_URLS = ['/', '/index.html', '/manifest.webmanifest'];

// Install: cache shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  );
});

// Activate: simple cleanup (here we just keep single cache)
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Fetch: cache-first for navigation and static
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).catch(() => {
        if (req.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
