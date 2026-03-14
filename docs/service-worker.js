/**
 * KisaanMitra - Service Worker v11 (Simple)
 * Basic caching for GitHub Pages
 */
const CACHE_NAME = 'kisaanmitra-v11';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API calls
    if (url.pathname.includes('/api/')) return;

    // For same-origin requests, try network first
    if (url.origin === location.origin) {
        event.respondWith(
            fetch(request).catch(() => {
                // If network fails, try to return cached version
                return caches.match(request).then(response => {
                    if (response) return response;
                    // Return index.html for navigation
                    return caches.match('/kisaanmitra/index.html');
                });
            })
        );
    }
});
