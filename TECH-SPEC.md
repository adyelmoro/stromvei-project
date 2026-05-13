# StrømVei — Technical Specification
**Version:** 1.0 | **Last Updated:** May 2026

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│   ┌─────────────────┐    ┌───────────────────────────────┐  │
│   │   Next.js 15    │    │       Mapbox GL JS            │  │
│   │   App Router    │    │   (client-side, canvas)       │  │
│   │   TypeScript    │    │                               │  │
│   │   Tailwind CSS  │    │   Nobil station data          │  │
│   └────────┬────────┘    │   Mapbox Directions route     │  │
│            │             │   Turf.js calculations        │  │
│            │             └───────────────────────────────┘  │
└────────────┼────────────────────────────────────────────────┘
             │
    ┌────────┼──────────────────────────────────────┐
    │        │         Next.js API Routes            │
    │  /api/nobil/stations  (proxy + cache)          │
    │  /api/nobil/station/[id]  (detail)             │
    │  /api/route  (OSRM proxy)                      │
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
    │  │  Auth (Google)                   │         │
    │  │  DB: saved_stations, saved_routes│         │
    │  └──────────────────────────────────┘         │
    └────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15.x | App Router, SSR, API Routes |
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
│   │   ├── layout.tsx              # Root layout, font, metadata
│   │   ├── page.tsx                # Home page — map view
│   │   ├── saved/
│   │   │   └── page.tsx            # Saved stations + routes (auth gated)
│   │   ├── about/
│   │   │   └── page.tsx            # About the project
│   │   └── api/
│   │       ├── nobil/
│   │       │   └── stations/
│   │       │       └── route.ts    # Nobil API proxy (hides API key)
│   │       └── route/
│   │           └── route.ts        # Mapbox Directions proxy
│   ├── components/
│   │   ├── map/
│   │   │   ├── Map.tsx             # Main MapLibre GL JS wrapper
│   │   │   ├── StationMarkers.tsx  # Cluster + individual markers
│   │   │   ├── StationDrawer.tsx   # Slide-in station detail panel
│   │   │   └── RouteLayer.tsx      # Drawn route + stop markers
│   │   ├── filters/
│   │   │   ├── FilterPanel.tsx     # Desktop filter sidebar
│   │   │   └── FilterSheet.tsx     # Mobile bottom sheet
│   │   ├── route-planner/
│   │   │   ├── RoutePlannerForm.tsx    # A/B/range inputs
│   │   │   ├── RoutePlannerResults.tsx # List of suggested stops
│   │   │   └── AddressSearch.tsx       # Mapbox Geocoder wrapper
│   │   ├── auth/
│   │   │   ├── AuthButton.tsx      # Sign in / Sign out
│   │   │   └── AuthProvider.tsx    # Supabase session context
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx           # Connector type, speed badges
│   │       ├── Drawer.tsx          # Reusable slide-in drawer
│   │       └── LanguageToggle.tsx  # NO/EN switch
│   ├── lib/
│   │   ├── nobil.ts                # Nobil API client + types
│   │   ├── maplibre.ts             # MapLibre helpers + config
│   │   ├── route-planner.ts        # Greedy algorithm implementation
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   └── server.ts           # Server Supabase client
│   │   └── i18n/
│   │       ├── no.ts               # Norwegian (Bokmål) strings
│   │       └── en.ts               # English strings
│   ├── hooks/
│   │   ├── useStations.ts          # Fetches + caches Nobil data
│   │   ├── useFilters.ts           # Filter state management
│   │   ├── useRoutePlanner.ts      # Route planner state + algorithm
│   │   └── useSavedPlaces.ts       # Supabase saved data
│   └── types/
│       ├── nobil.ts                # Nobil API response types
│       ├── map.ts                  # GeoJSON + MapLibre types
│       └── filters.ts              # Filter state types
├── public/
│   ├── favicon.ico
│   └── og-image.png                # Open Graph image for sharing
├── .env.example
├── .env.local                      # (gitignored)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

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

**Route planner geospatial:** Turf.js `nearestPointOnLine` is O(n) on the number of route vertices. Mapbox routes have ~500–2,000 vertices for Norway-length journeys. With 10,000 stations, the filter pass is 10,000 × 500 = 5M operations. This must run in a Web Worker to avoid blocking the UI thread.

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

**Domain:** TBD — stromvei.vercel.app initially, custom .no domain optional.

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
