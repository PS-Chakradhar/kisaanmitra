/**
 * KisaanMitra - Service Worker v9 (Full Offline + Voice Support)
 * Complete offline capability including smart caching
 */
const CACHE_NAME = 'kisaanmitra-v9';
const OFFLINE_URL = '/index.html';

const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/i18n.js',
    '/js/speech.js', 
    '/js/api.js',
    '/js/app.js',
    '/manifest.json'
];

// Pre-cache app shell for instant offline load
const APP_SHELL = ASSETS_TO_CACHE;

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                console.log('Caching offline assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            }),
            self.skipWaiting()
        ]).then(() => {
            console.log('KisaanMitra offline-ready!');
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip cross-origin requests except fonts
    if (url.origin !== location.origin) {
        // Cache Google fonts
        if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
            event.respondWith(cacheFirstStrategy(request));
        }
        return;
    }

    const path = url.pathname;
    
    // API calls - Network first with cache fallback
    if (path.includes('/api/')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Static assets - Stale while revalidate
    if (path.endsWith('.js') || path.endsWith('.css')) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // Fonts & images - Cache first with fallback
    if (path.includes('fonts.googleapis.com') || path.includes('fonts.gstatic.com') || path.includes('.png') || path.includes('.jpg') || path.includes('.svg') || path.includes('.ico')) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }

    // HTML pages - Network first for freshness
    if (path.endsWith('.html') || path === '/') {
        event.respondWith(networkFirstStrategy(request));
        return;
    }

    // Default - Cache first
    event.respondWith(cacheFirstStrategy(request));
});

async function cacheFirstStrategy(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (e) {
        return caches.match(OFFLINE_URL);
    }
}

async function networkFirstStrategy(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (e) {
        const cached = await caches.match(request);
        if (cached) return cached;
        
        // For API calls, return offline response
        if (request.url.includes('/api/')) {
            return new Response(JSON.stringify({ 
                offline: true, 
                message: 'Offline - using cached data',
                prices_available: true,
                calendar_available: true
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return caches.match(OFFLINE_URL);
    }
}

async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    });
    return cached || fetchPromise;
}