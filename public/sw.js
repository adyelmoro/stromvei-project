/**
 * StrømVei Service Worker
 *
 * Caching strategy:
 *  - NETWORK ONLY  : map tiles, routing, geocoding — stale data is worse than no data
 *  - CACHE FIRST   : Next.js static assets (/_next/static/*), icons, fonts
 *  - NETWORK FIRST : API proxy routes (/api/*) — server already caches these
 *  - NETWORK FIRST + cache fallback : HTML pages (app shell)
 */

const CACHE = "stromvei-v1";

// These hosts are always fetched from the network — never cache.
// Serving stale map tiles or route geometry would silently break the app.
const NETWORK_ONLY_HOSTS = [
  "openfreemap.org",
  "tiles.openfreemap.org",
  "router.project-osrm.org",
  "nominatim.openstreetmap.org",
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function isNetworkOnly(url) {
  return NETWORK_ONLY_HOSTS.some((host) => url.includes(host));
}

function isStaticAsset(url) {
  return (
    url.includes("/_next/static/") ||
    url.includes("/icons/") ||
    url.includes("/fonts/") ||
    url.endsWith(".svg") ||
    url.endsWith(".png") ||
    url.endsWith(".ico") ||
    url.endsWith(".webmanifest") ||
    url.endsWith("manifest.json")
  );
}

function isApiRoute(url) {
  const { pathname } = new URL(url);
  return pathname.startsWith("/api/");
}

// ── Install — pre-cache the app shell ────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
          "/",
          "/about",
          "/saved",
          "/icons/icon-192.png",
          "/icons/icon-512.png",
          "/favicon.svg",
        ])
      )
      .catch(() => {
        // Non-fatal — app still works, just no offline shell
      })
  );
  // Activate immediately without waiting for old tabs to close
  self.skipWaiting();
});

// ── Activate — purge old cache versions ──────────────────────────────────────

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// ── Fetch — route by strategy ─────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = request.url;

  // Only handle GET — pass through everything else (POST to /api, auth callbacks, etc.)
  if (request.method !== "GET") return;

  // Skip chrome-extension and non-http(s) requests
  if (!url.startsWith("http")) return;

  // ── 1. Network-only: map tiles, routing, geocoding ──────────────────────
  if (isNetworkOnly(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // ── 2. Cache-first: static assets (JS chunks, CSS, icons, fonts) ────────
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // ── 3. Network-first: API proxy routes (server has its own TTL cache) ───
  if (isApiRoute(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── 4. Network-first + cache fallback: HTML pages ───────────────────────
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
