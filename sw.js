const CACHE_NAME = 'ai-tools-guide-v1';
// যে ফাইলগুলো অফলাইনে সেভ রাখা প্রয়োজন
const urlsToCache = [
  './',
  './index.html', // আপনার HTML ফাইলের নাম
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// সার্ভিস ওয়ার্কার ইনস্টল করার সময় ফাইলগুলো ক্যাশ করা
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// যখন ব্যবহারকারী পেজটি লোড করবেন
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশে ফাইল থাকলে সেটি রিটার্ন করো
        if (response) {
          return response;
        }
        // না থাকলে ইন্টারনেট থেকে লোড করো
        return fetch(event.request);
      }
    )
  );
});

// পুরনো ক্যাশ ডিলিট করা (যদি অ্যাপ আপডেট করেন)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
