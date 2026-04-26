const CACHE = "botc-storyteller-v30";


const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./jinxes-embedded.js",
  "./globals.js",
  "./story-log.js",
  "./game-core.js",
  "./setup.js",
  "./game-draw.js",
  "./game-setup-modal.js",
  "./botc-abilities.js",
  "./state.js",
  "./idb-mirror.js",
  "./ui-town.js",
  "./ui-nightorder.js",
  "./private-info-overlay.js",
  "./roles/roles-master.json",
  "./roles/jinxes-master.json",
  "./roles/homebrew.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => (k === CACHE) ? null : caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ type: "SW_UPDATED" }));
        });
      })
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") {
    e.respondWith(fetch(req));
    return;
  }

  const url = new URL(req.url);

  if (url.origin !== self.location.origin) {
    e.respondWith(
      fetch(req).catch(() => caches.match(req))
        .then(r => r || new Response("", { status: 504, statusText: "Offline" }))
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      try {
        const network = await fetch(req);
        if (network.ok) {
          try {
            await cache.put(req, network.clone());
          } catch (_) {}
        }
        return network;
      } catch (_) {
        const cached = await cache.match(req);
        if (cached) return cached;
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })
  );
});
