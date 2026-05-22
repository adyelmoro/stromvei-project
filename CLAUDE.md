# StrømVei — Session Context
**Project:** Portfolio Project #1 — Norwegian EV charging map & smart route planner
**Developer:** Ayyad Anwar | iamayyad@gmail.com | github.com/adyelmoro
**Project directory:** A:\ClaudeAI\MyAI-Projects\stromvei
**Parent context:** A:\ClaudeAI\MyAI-Projects\CLAUDE.md
**GitHub:** https://github.com/adyelmoro/stromvei-project
**Live URL:** https://stromvei-project.vercel.app
**Supabase project:** jqvrkvggedlggftohbxb (region: eu-west-1)

---

## Status: ✅ ALL PHASES COMPLETE — SHIPPED WITH PWA

**Last updated:** 2026-05-21
All 9 phases complete. PWA support added (manifest.json, favicon.svg, theme-color, viewport export). Deployed and live.

---

## What This Project Is

Interactive map of 10,000+ Norwegian EV charging stations (Nobil API) with real-time filters and a smart route planner. User inputs origin, destination, and car range — the greedy algorithm finds optimal charging stops.

---

## Tech Stack (Actual — Deviations from original plan noted)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.6 (App Router) | |
| Language | TypeScript strict | |
| Styling | Tailwind CSS v3 | |
| Map | MapLibre GL JS 4.x | Mapbox fork — no API key or credit card |
| Map tiles | OpenFreeMap | tiles.openfreemap.org/styles/liberty — fully free |
| Geocoding | Nominatim (OpenStreetMap) | Proxied via /api/geocode — no key needed |
| Routing | OSRM public API | router.project-osrm.org — free, no key |
| Geospatial | Turf.js 6.x | nearestPointOnLine for route corridor filter |
| Data source | Nobil REST API | Norwegian EV station database — free, needs API key |
| Auth | Supabase Auth (Google) | Optional — for saved stations/routes |
| Database | Supabase PostgreSQL | saved_stations, saved_routes tables |
| PWA | manifest.json + favicon.svg | theme-color, display:standalone |
| Deployment | Vercel | Auto-deploy on push to main |

---

## Phase Status

| # | Phase | Status |
|---|-------|--------|
| 0 | Setup & Accounts | ✅ Done |
| 1 | Project Foundation | ✅ Done |
| 2 | Map & Station Data | ✅ Done |
| 3 | Filters | ✅ Done |
| 4 | Auth + Saved Places | ✅ Done |
| 5 | Mobile + Language | ✅ Done |
| 6 | Route Planner Core | ✅ Done |
| 7 | Route Planner Algorithm | ✅ Done |
| 8 | Polish & Production + PWA | ✅ Done |
| 9 | Post-Launch | ✅ Done (GitHub pin manual) |

---

## Key File Locations

```
src/
├── app/
│   ├── page.tsx                    — Home: full map + all overlay panels
│   ├── saved/page.tsx              — Saved stations (auth-gated)
│   ├── about/page.tsx              — About + Nobil API credit
│   ├── auth/callback/route.ts      — Supabase OAuth callback
│   └── api/
│       ├── nobil/stations/route.ts — Nobil proxy (15-min cache)
│       ├── route/route.ts          — OSRM proxy (1h cache)
│       └── geocode/route.ts        — Nominatim proxy (24h cache)
├── components/
│   ├── map/
│   │   ├── Map.tsx                 — MapLibre GL JS, cluster + route layers
│   │   ├── StationDrawer.tsx       — Station detail bottom sheet
│   │   ├── FilterPanel.tsx         — Speed/connector/network filters
│   │   ├── AddressSearch.tsx       — Nominatim autocomplete
│   │   └── PostcodeSearch.tsx      — Postcode → fly-to
│   ├── route/
│   │   └── RoutePlannerPanel.tsx   — Origin/dest/range form + results
│   ├── auth/
│   │   ├── AuthButton.tsx
│   │   └── AuthProvider.tsx
│   ├── layout/
│   │   └── BottomNav.tsx           — Mobile bottom nav
│   └── ui/
│       └── LanguageToggle.tsx
├── lib/
│   ├── nobil.ts                    — Nobil parser + stationsToGeoJSON
│   ├── route-planner.ts            — Greedy charging stop algorithm
│   ├── route-filter.ts             — filterStationsAlongRoute (5km corridor)
│   ├── route-planner-context.tsx   — Context bridge + hasActiveRoute
│   ├── mock-stations.ts            — 18 mock stations (Nobil key fallback)
│   ├── supabase/{client,server}.ts
│   └── i18n/{provider,no,en}.ts
├── hooks/
│   ├── useStations.ts
│   ├── useFilters.ts
│   └── useSavedPlaces.ts
└── types/
    ├── nobil.ts
    └── filters.ts
public/
├── favicon.svg                     — Bolt on dark squircle
├── og-image.svg                    — 1200×630 Open Graph
├── manifest.json                   — PWA manifest
├── logo-dark.svg
├── logo-light.svg
└── logo-mark.svg
```

---

## Important Technical Notes

- **MapLibre not Mapbox** — identical API, no credit card needed. Import from `maplibre-gl` not `mapbox-gl`.
- **"idle" event not "load"** — `isStyleLoaded()` returns false during tile fetches. Use `map.once("idle")` fallback when adding layers after user interaction. `map.once("load")` only fires once at startup.
- **Route line layer ordering** — use `CLUSTER_LAYER_ID` as `beforeId` when adding route layer. OpenFreeMap's first symbol layer lands below fill layers, making the line invisible.
- **Nobil API key** — registered at nobil.no. Free. Set as `NOBIL_API_KEY` (server-only, no NEXT_PUBLIC prefix).
- **10k marker performance** — Mapbox/MapLibre cluster source layer — do NOT render as React components.
- **Nominatim on Vercel** — proxied via `/api/geocode` to avoid Content Security Policy issues.
- **iOS keyboard** — all number/text inputs use `style={{ fontSize: "16px" }}` to prevent zoom.
- **Save route UI** — deferred post-MVP. `saved_routes` table exists in Supabase but UI not wired.

---

## Environment Variables

```env
NOBIL_API_KEY=                        # From nobil.no — server-only
NEXT_PUBLIC_SUPABASE_URL=             # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # Safe to expose
```

---

## Post-Launch Checklist

- [x] Deployed on Vercel
- [x] CV updated (stromvei-project.vercel.app in cv-build-may.js)
- [x] README complete with screenshots
- [x] GitHub repo public
- [x] LinkedIn post drafted (manual publish)
- [x] dev.to article drafted (manual publish)
- [ ] Pin repo on GitHub profile — **MANUAL — Ayyad does this in GitHub settings**
