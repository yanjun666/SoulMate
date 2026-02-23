// SoulMate Service Worker v1.0
// 这个文件让你的应用可以离线使用！

const CACHE_NAME = 'soulmate-cache-v1';

// 需要缓存的文件列表
const URLS_TO_CACHE = [
  '/',
  '/index.html',
];

// 安装事件：首次安装时缓存关键资源
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] 缓存核心资源');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        // 跳过等待，立即激活
        return self.skipWaiting();
      })
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] 激活中...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[ServiceWorker] 删除旧缓存:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // 立即接管所有页面
      return self.clients.claim();
    })
  );
});

// 请求拦截：优先网络，失败时使用缓存
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 请求成功，克隆响应并存入缓存
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，从缓存读取
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // 如果缓存也没有，返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('离线中', { status: 503 });
        });
      })
  );
});

// 推送通知（未来扩展）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || '你有新的消息',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: { url: data.url || '/' },
      actions: [
        { action: 'open', title: '查看' },
        { action: 'close', title: '关闭' },
      ],
    };
    event.waitUntil(
      self.registration.showNotification(data.title || 'SoulMate', options)
    );
  }
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      self.clients.openWindow(url)
    );
  }
});
