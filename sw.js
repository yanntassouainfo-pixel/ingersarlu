/* ============================================================
   INGER · Service Worker — cache & offline fallback
   - Stratégie : network-first pour HTML, cache-first pour assets
   - Page offline dédiée si réseau indisponible
   - Versionnez CACHE_VERSION pour forcer une mise à jour du cache
   ============================================================ */
const CACHE_VERSION = 'inger-v1';
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME  = `${CACHE_VERSION}-runtime`;

/* Coquille (shell) toujours mise en cache à l'install */
const SHELL = [
  './',
  './index.html',
  './offline.html',
  './carriere.html',
  './politique-confidentialite.html',
  './mentions-legales.html',
  './sitemap.html',
  './css/style.css',
  './js/script.js',
  './js/i18n.js',
  './js/chatbot.js',
  './js/cookies.js',
  './js/analytics.js',
  './images/01-hero-batiment.webp',
  './images/about-inger.webp',
  './favicon.svg',
  './favicon.ico',
  './favicon-32.png',
  './favicon-16.png',
  './apple-touch-icon.png',
  './site.webmanifest'
];

/* ---------- INSTALL : précache la coquille ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

/* ---------- ACTIVATE : purge des anciennes versions ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* ---------- FETCH : stratégies ---------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass : POST, autres méthodes, schémas non-http
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Bypass : domaines externes (analytics, fonts, web3forms, whatsapp)
  if (url.origin !== self.location.origin) {
    // Fonts Google : passthrough (laisser le navigateur gérer son cache HTTP)
    return;
  }

  // HTML (navigations) → network-first → cache → offline.html
  const isHTML = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy)).catch(()=>{});
          return res;
        })
        .catch(() => caches.match(req).then((cached) =>
          cached || caches.match('./offline.html')
        ))
    );
    return;
  }

  // Assets (css/js/img/webp/font) → cache-first → network (puis ajout cache)
  event.respondWith(
    caches.match(req).then((cached) => cached ||
      fetch(req).then((res) => {
        // Ne cache que les réponses OK / opaque
        if (!res || (res.status !== 200 && res.type !== 'opaque')) return res;
        const copy = res.clone();
        caches.open(RUNTIME).then((c) => c.put(req, copy)).catch(()=>{});
        return res;
      }).catch(() => {
        // Fallback image neutre si demande d'image échoue
        if (req.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#ECEAE2"/><text x="300" y="210" text-anchor="middle" fill="#6B6860" font-family="monospace" font-size="14">Image indisponible · offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      })
    )
  );
});

/* ---------- MESSAGE : permet un skipWaiting manuel ---------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
