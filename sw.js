const CACHE_NAME = 'voley-stats-v1';
// Lista de archivos para guardar permanentemente en el celular
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './libs/tailwind.js',
  './libs/charts.js',
  './img/logo.png'
];

// 1. Instalación: Guarda los archivos en el disco del celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando archivos para modo offline...');
      return cache.addAll(ASSETS);
    })
  );
  // Fuerza a que el SW se active de inmediato
  self.skipWaiting();
});

// 2. Activación: Limpia caches viejas
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

// 3. Intercepción: Si no hay internet, sirve los archivos del cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
