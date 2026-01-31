importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");

const uv = new UVServiceWorker();

self.addEventListener("fetch", event => {
  event.respondWith(uv.fetch(event));
});
