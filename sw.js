const CACHE_NAME = 'cv-stats-final-v1';

// Archivos según tu versión estable [cite: 2025-12-04]
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './libs/tailwind.js',
  './libs/charts.js',
  './img/logo.png'
];

// Instalación: Guarda los archivos uno por uno
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.log('No se pudo guardar:', url));
        })
      );
    })
  );
  self.skipWaiting();
});

// Activación: Limpia memorias antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Intercepción: Entrega el archivo desde el disco si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en cache, lo da. Si no, intenta internet.
      return response || fetch(event.request).catch(() => {
        // Si falla internet y es el index, lo entrega forzado
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
