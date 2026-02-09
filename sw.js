const CACHE_NAME = 'control-voley-v4';

// Lista de archivos que el navegador GUARDARÁ en el disco duro/memoria
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './libs/tailwind.js',
  './libs/charts.js',
  './img/logo.png'
];

// 1. INSTALACIÓN: Ocurre la primera vez que abres la web con internet
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando archivos para modo offline...');
      // Usamos un bucle para que si un archivo falla, no detenga a los demás
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.log('Error cacheando:', url));
        })
      );
    })
  );
  self.skipWaiting(); // Obliga al SW a activarse sin esperar
});

// 2. ACTIVACIÓN: Limpia versiones antiguas para que no ocupen espacio
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

// 3. INTERCEPCIÓN (FETCH): El motor que entrega los archivos sin internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si el archivo está en la memoria (Cache), lo entrega de inmediato
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Si no está en memoria, intenta ir a buscarlo a internet
      return fetch(event.request).catch(() => {
        // Si falla el internet y el usuario intenta entrar al inicio, 
        // le servimos el index.html que tenemos guardado.
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
