# StrømVei — Technical Specification
**Version:** 1.0 | **Last Updated:** May 2026

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   ┌─────────────────┐    ┌───────────────────────────────┐  │
│   │   Next.js 16    │    │     MapLibre GL JS 4.x        │  │
│   │   App Router    │    │   (client-side, canvas)       │  │
│   │   TypeScript    │    │                               │  │
│   │   Tailwind CSS  │    │   Nobil station data          │  │
│   └────────┬────────┘    │   OSRM route geometry         │  │
│            │             │   Turf.js calculations        │  │
│            │             └───────────────────────────────┘  │
└────────────┼────────────────────────────────────────────────┘
             │
    ┌────────┼──────────────────────────────────────┐
    │        │         Next.js API Routes            │
    │  /api/nobil/stations  (proxy + 15min cache)    │
    │  /api/route  (OSRM proxy + 1h cache)           │
    │  /api/geocode  (Nominatim proxy + 24h cache)   │
    │  /auth/callback  (Supabase OAuth)              │
    └────────┼──────────────────────────────────────┘
             │
    ┌────────┼──────────────────────────────────────┐
    │        │       External Services               │
    │                                                │
    │  ┌─────────────┐  ┌──────────────┐            │
    │  │  Nobil API  │  │  OSRM API    │            │
    │  │  (stations) │  │  (routing,   │            │
    │  │  Free       │  │   free)      │            │
    │  └─────────────┘  └──────────────┘            │
    │                                                │
    │  ┌─────────────┐  ┌──────────────┐            │
    │  │  Nominatim  │  │ OpenFreeMap  │            │
    │  │  (geocoding │  │ (map tiles,  │            │
    │  │   free)     │  │  free)       │            │
    │  └─────────────┘  └──────────────┘            │
    │                                                │
    │  ┌──────────────────────────────────┐         │
    │  │         Supabase                 │         │
    │  │  Auth (Google OAuth)             │         │
    │  │  DB: saved_stations              │         │
    │  └──────────────────────────────────┘         │
    └────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.x | App Router, SSR, API Routes |
| Language | TypeScript | 5.x | Strict mode, no `any` |
| Styling | Tailwind CSS | 3.x | Utility-first, no extra CSS |
| Map | MapLibre GL JS | 4.x | Open-source map, clustering, layers — no API key needed |
| Map tiles | OpenFreeMap | - | Free OSM-based vector tiles, no key, no signup |
| Geocoding | Nominatim (OpenStreetMap) | - | Free address search, no key needed |
| Routing | OSRM public API | - | Free open-source routing, no key needed |
| Geospatial | Turf.js | 6.x | nearestPointOnLine, distance, along |
| Data source | Nobil REST API | v3 | Norwegian EV station database |
| Auth | Supabase Auth | 2.x | Google Sign-In, session management |
| Database | Supabase PostgreSQL | - | saved_stations, saved_routes |
| Deployment | Vercel | - | Next.js native, free tier |
| Package manager | pnpm | 9.x | Faster than npm, better disk usage |

---

## Project Structure

```
stromvei/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, font, metadata, PWA manifest
│   │   ├── page.tsx                # Home page — map view + all overlay panels
│   │   ├── saved/
│   │   │   └── page.tsx            # Saved stations (auth gated)
│   │   ├── about/
│   │   │   └── page.tsx            # About the project
│   │   ├── auth/
│   │   │   └── callback/route.ts   # Supabase OAuth callback
│   │   └── api/
│   │       ├── nobil/stations/
│   │       │   └── route.ts        # Nobil API proxy (15-min module-level cache)
│   │       ├── route/
│   │       │   └── route.ts        # OSRM proxy (1h cache)
│   │       └── geocode/
│   │           └── route.ts        # Nominatim proxy (24h cache, CSP bypass)
│   ├── components/
│   │   ├── map/
│   │   │   ├── Map.tsx             # MapLibre GL JS — cluster + route + suggested stop layers
│   │   │   ├── StationDrawer.tsx   # Station detail bottom sheet (mobile) / floating card (desktop)
│   │   │   ├── FilterPanel.tsx     # Filter panel (speed, connector, network)
│   │   │   ├── AddressSearch.tsx   # Nominatim autocomplete with justSelectedRef anti-flicker
│   │   │   └── PostcodeSearch.tsx  # Postcode → fly-to on map
│   │   ├── route/
│   │   │   └── RoutePlannerPanel.tsx  # Origin/dest inputs, range, stop results
│   │   ├── auth/
│   │   │   ├── AuthButton.tsx      # Sign in with Google / avatar + dropdown
│   │   │   └── AuthProvider.tsx    # Supabase session context
│   │   ├── layout/
│   │   │   └── BottomNav.tsx       # Mobile bottom navigation (Map / Saved / About / Route)
│   │   └── ui/
│   │       └── LanguageToggle.tsx  # NO/EN pill switch
│   ├── lib/
│   │   ├── nobil.ts                # Nobil parser + stationsToGeoJSON
│   │   ├── route-planner.ts        # Greedy charging stop algorithm (Turf.js)
│   │   ├── route-filter.ts         # filterStationsAlongRoute (5km corridor)
│   │   ├── route-planner-context.tsx  # Context: toggle bridge + hasActiveRoute
│   │   ├── mock-stations.ts        # 18 mock stations (fallback when no Nobil key)
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   └── server.ts           # Server Supabase client
│   │   └── i18n/
│   │       ├── provider.tsx        # I18nProvider + useI18n hook
│   │       ├── no.ts               # Norwegian (Bokmål) strings
│   │       └── en.ts               # English strings
│   ├── hooks/
│   │   ├── useStations.ts          # Fetches Nobil data; mock fallback; filter application
│   │   ├── useFilters.ts           # Filter state: speed, connector, network
│   │   └── useSavedPlaces.ts       # Supabase saved_stations CRUD (optimistic updates)
│   └── types/
│       ├── nobil.ts                # NobilStation + ConnectorType types
│       └── filters.ts              # Filters type
├── public/
│   ├── favicon.svg                 # App icon (bolt on dark squircle)
│   ├── og-image.svg                # Open Graph image (1200×630)
│   ├── manifest.json               # PWA manifest
│   ├── logo-dark.svg
│   ├── logo-light.svg
│   └── logo-mark.svg
├── .env.example
├── .env.local                      # (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Architecture Deviations from Original Spec

| Spec | Actual | Reason |
|------|--------|--------|
| Next.js 15 | Next.js 16.2.6 | Latest stable at project start |
| Mapbox GL JS | MapLibre GL JS 4.x | Mapbox requires credit card; MapLibre is open-source fork with identical API |
| Mapbox Directions | OSRM public API | Same reason — no card, no key |
| Mapbox Geocoder | Nominatim (OpenStreetMap) | Free, keyless, Norway-specific |
| Web Worker for Turf | Main thread | Routes up to ~750 km; algorithm runs in <5ms with 18 mock stations; defer to real-data phase |
| `map.once("load")` fallback | `map.once("idle")` | `isStyleLoaded()` returns false during tile fetches; `"load"` only fires once at startup; `"idle"` fires whenever rendering completes |
| `firstSymbolId` as beforeId | `CLUSTER_LAYER_ID` | OpenFreeMap's first symbol layer is below fill layers; route line invisible |
| StationMarkers.tsx | Inline in Map.tsx | Simpler — all layers managed in one place |
| RouteLayer.tsx | Inline in Map.tsx | Same — remove/re-add pattern cleaner in one useEffect |
| saved_routes table | Not implemented | Phase 7 scope reduced — algorithm works, UI save deferred to post-MVP |

---

## Data Model

### Nobil Station (from API)

```typescript
type NobilStation = {
  id: string
  name: string
  position: {
    lat: number
    lng: number
  }
  address: {
    street: string
    city: string
    postalCode: string
    municipality: string
    county: string
  }
  connectors: Array<{
    id: string
    type: 'CCS' | 'CHAdeMO' | 'Type2' | 'Tesla' | 'Other'
    speedKw: number
    speed: 'slow' | 'fast' | 'rapid'  // derived: <22kW, 22-50kW, >50kW
    status: 'available' | 'occupied' | 'unknown'
  }>
  network: string                   // "Recharge", "IONITY", "Tesla", etc.
  openingHours: string | null
  totalConnectors: number
}
```

### Supabase Database Schema

```sql
-- Saved stations
create table saved_stations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  station_id text not null,              -- Nobil station ID
  station_name text not null,
  station_lat float not null,
  station_lng float not null,
  created_at timestamptz default now()
);

-- Saved routes
create table saved_routes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,                    -- user-given name
  origin_name text not null,
  origin_lat float not null,
  origin_lng float not null,
  destination_name text not null,
  destination_lat float not null,
  destination_lng float not null,
  car_range_km int not null,
  min_charge_pct int not null default 20,
  stop_station_ids text[] not null,      -- ordered array of Nobil IDs
  created_at timestamptz default now()
);

-- RLS: users can only see their own rows
alter table saved_stations enable row level security;
alter table saved_routes enable row level security;

create policy "users own their saved_stations"
  on saved_stations for all using (auth.uid() = user_id);

create policy "users own their saved_routes"
  on saved_routes for all using (auth.uid() = user_id);
```

---

## API Design

### GET /api/nobil/stations

Proxies the Nobil API, hides the API key, adds caching.

**Query params:**
- `bbox` — bounding box: `{lat1},{lng1},{lat2},{lng2}` (for route-corridor queries)
- None = returns all Norwegian stations

**Response:**
```json
{
  "stations": NobilStation[],
  "count": number,
  "cached": boolean,
  "cachedAt": string
}
```

**Caching strategy:** Nobil data does not update frequently. Cache in memory with a 15-minute TTL. On first request, fetch all stations, parse to NobilStation[], store. Subsequent requests return cache. This means only 1 Nobil API call per 15 minutes regardless of how many users visit.

### GET /api/route

Proxies OSRM public API. No token needed — proxied to avoid CORS and add caching.

**Query params:**
- `origin` — `{lng},{lat}`
- `destination` — `{lng},{lat}`
- `profile` — `driving` (default)

**Response:** GeoJSON route geometry (converted from OSRM format)

---

## Route Planner Algorithm

Full implementation in `src/lib/route-planner.ts`:

```typescript
type RoutePlannerInput = {
  origin: [number, number]       // [lng, lat]
  destination: [number, number]  // [lng, lat]
  carRangeKm: number
  minChargePercent: number       // default: 20
  connectorTypes?: string[]      // optional filter
  stations: NobilStation[]       // all loaded stations
  routeGeometry: GeoJSON.LineString
}

type ChargingStop = {
  station: NobilStation
  distanceFromPrevStopKm: number
  distanceAlongRouteKm: number
}

type RoutePlannerResult =
  | { success: true; stops: ChargingStop[] }
  | { success: false; reason: 'no_station_in_range' | 'destination_unreachable' }
```

**Algorithm steps:**

```typescript
function planRoute(input: RoutePlannerInput): RoutePlannerResult {
  const effectiveRangeKm = input.carRangeKm * (1 - input.minChargePercent / 100)
  const stopsOnRoute = filterStationsAlongRoute(input.stations, input.routeGeometry, 5) // 5km corridor
  
  let currentPosition = input.origin
  let currentDistanceAlongRoute = 0
  const stops: ChargingStop[] = []
  
  while (!canReachDestination(currentPosition, input.destination, effectiveRangeKm)) {
    const reachableStops = stopsOnRoute.filter(s =>
      haversineDistance(currentPosition, s.position) <= effectiveRangeKm &&
      s.distanceAlongRoute > currentDistanceAlongRoute
    )
    
    if (reachableStops.length === 0) {
      return { success: false, reason: 'no_station_in_range' }
    }
    
    // Pick the station furthest along the route
    const bestStop = reachableStops.reduce((best, s) =>
      s.distanceAlongRoute > best.distanceAlongRoute ? s : best
    )
    
    stops.push(bestStop)
    currentPosition = [bestStop.station.position.lng, bestStop.station.position.lat]
    currentDistanceAlongRoute = bestStop.distanceAlongRoute
  }
  
  return { success: true, stops }
}
```

---

## Performance Considerations

**10,000 station markers:** MapLibre GL JS handles this natively with its Cluster source feature. Do NOT render 10,000 React components as markers — this will crash the browser. Use MapLibre's built-in source/layer approach:

```typescript
map.addSource('stations', {
  type: 'geojson',
  data: stationsGeoJSON,
  cluster: true,
  clusterMaxZoom: 12,
  clusterRadius: 50
})
```

**Nobil data size:** ~10,000 stations at ~300 bytes each = ~3MB raw. After parsing to our NobilStation type: ~2MB. This is fetched once on load and cached. Acceptable.

**Route planner geospatial:** Turf.js `nearestPointOnLine` is O(n) on the number of route vertices. OSRM routes have ~500–2,000 vertices for Norway-length journeys. With 10,000 stations, the filter pass is 10,000 × 500 = 5M operations. Currently runs on the main thread (acceptable with 18 mock stations / fast with real data up to ~750 km); move to a Web Worker if performance degrades with full 10,000 station dataset.

---

## Deployment (Vercel)

**Environment variables (set in Vercel dashboard):**
```
NOBIL_API_KEY                # Nobil private key (server-only, no NEXT_PUBLIC prefix)
NEXT_PUBLIC_SUPABASE_URL     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key (safe to expose)
```

No Mapbox token needed — all map/routing/geocoding services are free and keyless.

**Build config:** Standard Next.js on Vercel — zero config needed.

**Domain:** stromvei-project.vercel.app (live). Custom .no domain optional post-launch.

---

## External API Notes

### Nobil API
- Base URL: `https://nobil.no/api/server/`
- Documentation: https://nobil.no/index.php/en/api
- Authentication: API key in request header
- Rate limits: Not published — proxy and cache to be safe
- Data update frequency: Varies by station. Real-time availability is approximate.
- Free to use for non-commercial open-source projects (confirm terms)

### MapLibre GL JS
- Open-source, MIT license, no API key, no account required
- Drop-in replacement for Mapbox GL JS (same source/layer/event API)
- Map tiles from OpenFreeMap: `https://tiles.openfreemap.org/styles/liberty`
- No tile rate limits for reasonable usage

### OSRM (Open Source Routing Machine)
- Public demo server: `https://router.project-osrm.org`
- No API key required
- Endpoint: `/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=full&geometries=geojson`
- Rate limits: ~1 req/sec on public server — acceptable for portfolio use
- Response includes GeoJSON LineString geometry

### Nominatim (OpenStreetMap Geocoding)
- Public API: `https://nominatim.openstreetmap.org/search`
- No API key required
- Params: `?q={address}&countrycodes=no&format=json&limit=5` (Norway only)
- Rate limit: 1 request/second — enforce with debounce on the search input

### Supabase
- Free tier: 500MB database, 1GB bandwidth, 50MB file storage
- Auth: unlimited users on free tier
- No credit card required for free tier
