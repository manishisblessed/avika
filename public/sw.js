/**
 * Placeholder worker: Chrome and some extensions periodically request /sw.js.
 * Lifecycle only — no fetch handler, so navigations stay default (network).
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
