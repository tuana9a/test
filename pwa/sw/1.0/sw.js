/**
 * EXPLAIN: fetch cached data, make new request then cached if missed
 */

const CACHE_NAME = 'service-worker-1.0';
const OFFLINE_URL = '/pages/offline.html';

const URL_TO_CACHE = ['/$', '/index.html$', '/favicon.ico$', '/style/main.css$', '/images/still_life_medium.jpg$'];

self.addEventListener('install', function (event) {
    URL_TO_CACHE = URL_TO_CACHE.map((each) => new RegExp(each));
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            // Setting {cache: 'reload'} in the new request will ensure that the
            // response isn't fulfilled from the HTTP cache; i.e., it will be from
            // the network.
            await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
            await cache.add(new Request('/index.html', { cache: 'reload' }));
        })()
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    var cacheAllowList = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheAllowList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(async function (cache) {
                //EXPLAIN: cache hit
                if (cache) return cache;

                //EXPLAIN: cache missed
                try {
                    const response = await fetch(event.request).catch();

                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // CAUTION: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var response_clone = response.clone();

                    let url = event.request.url;
                    if (URL_TO_CACHE.some((each) => url.match(each))) {
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, response_clone);
                        });
                    }

                    return response;
                } catch (err) {
                    const cache = await caches.open(CACHE_NAME);
                    const response = await cache.match(OFFLINE_URL);
                    return response;
                }
            })
            .catch()
    );
});
