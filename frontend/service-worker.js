/**
 * KisaanMitra - Service Worker v12 (Aggressive Cache Clear)
 * Forces clients to bypass the old cached API file
 */
const CACHE_NAME = 'kisaanmitra-v12';

self.addEventListener('install', event => {
    // Force immediate installation
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    // Aggressively clear ALL old caches to ensure the new api.js is loaded
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all open pages immediately
            console.log('[Service Worker] Claiming clients');
            return clients.claim();
        })
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API calls from caching entirely
    if (url.pathname.includes('/api/')) return;

    // Network-first strategy for everything else
    if (url.origin === location.origin) {
        event.respondWith(
            fetch(request).catch(() => {
                // If network fails (offline), try to return cached version
                return caches.match(request).then(response => {
                    if (response) return response;
                    // Return index.html for navigation as last resort
                    return caches.match('/kisaanmitra/index.html');
                });
            })
        );
    }
});
