// Use CDN for uv.bundle.js
importScripts("https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.bundle.js");
importScripts("/uv/uv.config.js");

const uv = new UVServiceWorker();

self.addEventListener("fetch", event => {
  event.respondWith(uv.fetch(event));
});
