const CACHE_NAME = 'voley-stats-v2'; // Cambié esto a v2 para forzar limpieza
const urlsToCache = [
  './',
  './index.html',
  './index_menu.html',
  './index_estad.html',
  './manifest.json',
  './img/logo.png',
  './libs/tailwind.js',
  './libs/charts.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Obliga al SW nuevo a activarse de inmediato
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName); // Aquí es donde se borra el botón viejo
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
