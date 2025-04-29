const cacheDataName = "sync-board-v1-3-1-1";

const staticAssets = [
  "/assets/index.js",
  "/assets/index.css",
  "/assets/pasteboard_logo.png",
  "/assets/clipboard.webp",
  "/assets/no-internet.webp",
  "/assets/avatar-Jv.webp",
  "/assets/avatar-Uzumaki.webp",
  "/assets/cloud-computing.png",
  "/assets/feedbackAvatar.png",
  "/assets/network.webp",
  "/assets/moon.svg",
  "/assets/sun.webp",
  "/assets/upload.png",
  "/assets/copy.svg",
  "/assets/right-arrow.svg",
  "/assets/release-icon.svg",
  "/assets/major-update-icon.svg",
  "/assets/alpha-icon.svg",
  "/favicon/android-chrome-192x192.png",
  "/favicon/android-chrome-512x512.png",
  "/favicon/apple-touch-icon.png",
  "/favicon/favicon-16x16.png",
  "/favicon/favicon-32x32.png",
  "/favicon/favicon.ico",
  "/favicon/site.webmanifest",
  "/manifest.json",
  "/index.html",
  "/",
];
const CACHE_NAME = "syncboard-v1";
const OFFLINE_URL = "/offline.html";

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch - Network First
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(OFFLINE_URL);
    })
  );
});