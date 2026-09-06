const CACHE_NAME = 'silsilah-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 1. INSTALASI: Menyimpan file utama ke dalam Cache agar website bisa dibuka lebih cepat
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Gunakan catch agar jika ada file yang belum ada (seperti icon) proses install tidak gagal
        return cache.addAll(urlsToCache).catch(err => console.log('Beberapa aset gagal di-cache:', err));
      })
  );
});

// 2. AKTIVASI: Membersihkan Cache versi lama jika ada pembaruan
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. PENGAMBILAN (FETCH): Strategi "Network First"
// Selalu usahakan ambil data langsung dari internet agar data Silsilah selalu UPDATE. 
// Jika internet putus (offline), baru tampilkan versi Cache.
self.addEventListener('fetch', event => {
  // Abaikan request dari Apps Script (Google) agar tidak mengganggu sistem form/database
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
