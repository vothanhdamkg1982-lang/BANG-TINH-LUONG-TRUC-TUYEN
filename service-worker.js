// Tên cache – thay đổi khi bạn cập nhật ứng dụng
const CACHE_NAME = 'salary-cache-v1';
const urlsToCache = [
  '.',                // index.html
  'index.html',
  'manifest.json'
  // Nếu bạn có các file CSS/JS riêng, thêm vào đây
  // Nếu bạn dùng Font Awesome CDN, có thể thêm URL vào để cache:
  // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  // 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap'
];

// Cài đặt service worker – cache tài nguyên
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache mở thành công');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Lỗi cache:', err))
  );
});

// Kích hoạt – xóa cache cũ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Chiến lược: Cache-first, fallback network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // trả về từ cache
        }
        return fetch(event.request); // nếu không có, gọi network
      })
  );
});