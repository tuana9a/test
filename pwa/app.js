"use strict";

const CACHE_NAME = "webapp";
const URL_TO_CACHE = ["/"];
const SERVICE_WORKER_FILE = "";

class ServiceWorkerManager {
    registerWorker() {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker
                    .register(SERVICE_WORKER_FILE)
                    .then(function () {
                        console.log("Service Worker registered");
                    })
                    .catch(function () {
                        console.error("Service Worker register failed");
                    });
            });
        }
    }
    async unregisterServiceWorkers() {
        return navigator.serviceWorker.getRegistrations().then(function (serviceWorkers) {
            serviceWorkers.forEach(function (serviceWorker) {
                return serviceWorker.unregister();
            });
        });
    }
}
const serviceWorkerManager = new ServiceWorkerManager();

class NotificationManager {
    requestNotificationPermission() {
        Notification.requestPermission(function (status) {
            console.log("notification permission status:", status);
        });
    }
    sendNotification(
        options = {
            body: "Here is a notification body!",
            icon: "icons/apple-icon-180.png",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
            },
            actions: [
                {
                    action: "explore",
                    title: "Explore this new world",
                    icon: "icons/apple-icon-180.png",
                },
                {
                    action: "close",
                    title: "Close notification",
                    icon: "icons/apple-icon-180.png",
                },
            ],
        }
    ) {
        if (Notification.permission == "granted") {
            navigator.serviceWorker.getRegistration().then(function (registration) {
                registration.showNotification("Hello world!", options);
            });
        }
    }
}
const nofiticationManager = new NotificationManager();

class CachesManager {
    async clearAllCaches() {
        return caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        });
    }
    async getBackupCaches() {
        let cache = await caches.open(CACHE_NAME);
        let backup = new Map();
        for (const url of URL_TO_CACHE) {
            backup.set(url, await cache.match(new Request(url)));
        }
        return backup;
    }
    async updateCaches() {
        await cachesManager.clearAllCaches();
        let cache = await caches.open(CACHE_NAME);
        return cache.addAll(
            URL_TO_CACHE.map(function (url) {
                return new Request(url, { cache: "reload" });
            })
        );
    }
}
const cachesManager = new CachesManager();

class HttpRequestOption {
    method = "";
    url = "";
    headers = {};
    data = {};
}
class HttpClientService {
    async ajax(option = new HttpRequestOption(), done = console.log, error = console.log) {
        return new Promise((resolve, reject) => {
            try {
                let xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function (e) {
                    if (String(this.status).match(/^(4\d\d|5\d\d)$/)) {
                        reject(e);
                    }
                };

                xhttp.onload = function (e) {
                    let data;
                    try {
                        data = JSON.parse(xhttp.response);
                    } catch (e) {
                        data = { success: false, body: xhttp.response, note: "Error: Parse JSON" };
                    }
                    resolve(data);
                };
                xhttp.onerror = function (e) {
                    error(e);
                    reject(e);
                };
                xhttp.ontimeout = function (e) {
                    reject(e);
                };

                xhttp.open(option.method, option.url);
                xhttp.setRequestHeader("accept", "*/*");
                xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                if (option.headers) {
                    for (const header in option.headers) {
                        xhttp.setRequestHeader(header, option.headers[`${header}`]);
                    }
                }

                xhttp.send(JSON.stringify(option.data));
            } catch (e) {
                reject(e);
            }
        })
            .then(done)
            .catch(error);
    }
}
const httpClientService = new HttpClientService();

function test() {
    nofiticationManager.sendNotification(
        (options = {
            body: "Here is a notification body!",
            icon: "icons/apple-icon-180.png",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1,
            },
            actions: [
                {
                    action: "explore",
                    title: "Explore this new world",
                    icon: "icons/apple-icon-180.png",
                },
                {
                    action: "close",
                    title: "Close notification",
                    icon: "icons/apple-icon-180.png",
                },
            ],
        })
    );
}
