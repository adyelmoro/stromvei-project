# StrømVei — EV Charging Map & Route Planner for Norway

> **Live:** [stromvei-project.vercel.app](https://stromvei-project.vercel.app)

A full-stack web app that maps Norway's 10,000+ EV charging stations and plans smart charging stops for long-distance routes. Built with Next.js, MapLibre GL JS, and the free Nobil API.

---

## Features

- **Interactive map** — clusters 10,000+ stations via MapLibre GL JS GeoJSON source, colour-coded by charging speed (rapid / fast / slow)
- **Station details** — tap any station to see connectors, kW, live availability status, operator, and opening hours
- **Filters** — filter by charging speed, connector type (CCS, CHAdeMO, Type 2, Tesla), and network operator
- **Route planner** — enter origin + destination, set your car's range and minimum charge buffer; a greedy algorithm picks the optimal charging stops along the route using OSRM geometry
- **Charging stop algorithm** — suggested stops appear as highlighted markers on the map, with distances from the previous stop
- **Saved stations** — sign in with Google and bookmark favourite charging stations; stored in Supabase
- **Address search** — Norwegian address autocomplete via Nominatim, proxied server-side
- **Bilingual UI** — full Norwegian (Bokmål) and English via a lightweight i18n system
- **Mobile-first** — bottom sheet panels, bottom navigation bar, iOS keyboard zoom prevention

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Styling | Tailwind CSS |
| Map | MapLibre GL JS 4.x (open-source Mapbox fork — no API key) |
| Map tiles | OpenFreeMap (`tiles.openfreemap.org/styles/liberty`) |
| Geocoding | Nominatim / OpenStreetMap (free, no key) |
| Routing | OSRM public API (free, no key) |
| Geospatial | Turf.js (`nearestPointOnLine`, `bbox`, `length`) |
| Station data | Nobil REST API v3 (Norwegian EV database, ~10,000 stations) |
| Auth | Supabase Auth (Google Sign-In) |
| Database | Supabase PostgreSQL (saved stations) |
| Deployment | Vercel |

**Zero paid API keys required** — MapLibre, OSRM, Nominatim, and OpenFreeMap are all free and keyless. Only Nobil (free registration) and Supabase (free tier) require accounts.

---

## Architecture

```
Browser
  └── Next.js App Router (TypeScript)
        ├── MapLibre GL JS (canvas — cluster source, route layers, suggested stops)
        ├── src/lib/route-planner.ts  ← greedy charging stop algorithm (Turf.js)
        └── src/app/api/
              ├── /nobil/stations  ← proxies Nobil API, 15-min memory cache
              ├── /route           ← proxies OSRM, 1h cache
              └── /geocode         ← proxies Nominatim, 24h cache
```

### Route Planner Algorithm

Given a route geometry (GeoJSON LineString from OSRM), the algorithm:

1. Projects all stations onto the route using `nearestPointOnLine` (5 km corridor)
2. Sorts projected stations by distance along route
3. Greedy: from the current position, pick the **furthest reachable** station within `range × (1 − minCharge%)`
4. Repeats until destination is reachable

Returns `{ ok: true, stops: ChargingStop[] }` or an error (`no_station_in_range` / `destination_unreachable`).

---

## Running Locally

```bash
git clone https://github.com/adyelmoro/stromvei-project.git
cd stromvei-project
npm install

# Copy and fill in the environment variables
cp .env.example .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app falls back to mock station data if the Nobil API key is not set.

### Environment Variables

```env
# Nobil API — register free at nobil.no
NOBIL_API_KEY=your_nobil_api_key_here

# Supabase — create a free project at supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your_key_here

# No Mapbox token needed — MapLibre + OpenFreeMap are free and keyless
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — map + all overlay panels
│   ├── saved/page.tsx        # Saved stations (auth-gated)
│   ├── about/page.tsx        # About + tech stack
│   └── api/                  # Server-side proxies (nobil, route, geocode)
├── components/
│   ├── map/                  # Map.tsx, StationDrawer, FilterPanel, AddressSearch
│   ├── route/                # RoutePlannerPanel
│   ├── auth/                 # AuthProvider, AuthButton
│   └── ui/                   # LanguageToggle, BottomNav
├── lib/
│   ├── route-planner.ts      # Greedy algorithm
│   ├── route-filter.ts       # Corridor station filter
│   ├── nobil.ts              # Nobil API parser + GeoJSON converter
│   ├── mock-stations.ts      # 18 mock stations (dev fallback)
│   ├── route-planner-context.tsx
│   └── i18n/                 # no.ts + en.ts strings
├── hooks/                    # useStations, useFilters, useSavedPlaces
└── types/                    # nobil.ts, filters.ts
```

---

## Norwegian Context

**Nobil** is Norway's national EV charging station database, operated by the Norwegian Electric Vehicle Association (Norsk elbilforening). The API is free for non-commercial use and contains real-time availability data for ~10,000 stations across Norway.

Norway has the highest EV adoption rate in the world (~90% of new car sales in 2024). Long-distance route planning with charging stops is a genuine everyday problem for Norwegian drivers.

---

## What I Learned

- **MapLibre GL JS clustering** — GeoJSON cluster source handles 10,000+ markers without performance issues; React marker components at this scale would crash the browser
- **MapLibre event timing** — `isStyleLoaded()` returns false during tile fetches after user interactions; `map.once("load")` never re-fires; the reliable fallback is `map.once("idle")`
- **Layer ordering in OpenFreeMap** — the first symbol layer (`firstSymbolId`) sits below fill layers, making route lines invisible; using a known layer (`clusters`) as `beforeId` ensures correct z-ordering
- **Greedy geospatial algorithms** — `nearestPointOnLine` with `{ units: "kilometers" }` returns `properties.location` in km (not 0–1 fraction), enabling direct distance comparison
- **Next.js App Router patterns** — context bridging between layout.tsx and page.tsx via React context; lifted state for algorithm inputs

---

## License

MIT — free to use, fork, and learn from.

---

*Built by [Ayyad Anwar](https://github.com/adyelmoro) — May 2026*
