const CACHE_NAME = 'silsilah-cache-v2';

// 💡 HANYA masukkan file yang BENAR-BENAR ADA di repositori GitHub Anda
const urlsToCache = [
  '/',
  '/index.html',
  '/og-image.png'
];

// 1. INSTALASI: Menyimpan file utama ke dalam Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache berhasil dibuka');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Gagal menyimpan cache, periksa nama file:', err))
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
self.addEventListener('fetch', event => {
  // Abaikan request ke Apps Script agar form tetap berjalan normal
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
