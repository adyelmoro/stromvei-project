# StrømVei — Project Tracker
**Format:** Kanban | **Updated:** Start of build

---

## Status Key
- `[ ]` — Not started
- `[~]` — In progress
- `[x]` — Done
- `[!]` — Blocked / needs decision

---

## Phase 0 — Setup & Accounts (Before Day 1)

| Task | Status | Notes |
|------|--------|-------|
| Register at nobil.no and get API key | `[~]` | Registered 2026-05-13, awaiting email (1–2 working days) |
| Create Supabase project | `[x]` | Project ID: jqvrkvggedlggftohbxb, region eu-west-1 |
| Create GitHub repo `stromvei` (public) | `[x]` | github.com/adyelmoro/stromvei-project |
| Create Vercel account + connect GitHub | `[x]` | Connected and auto-deploy configured |
| Confirm domain name: StrømVei | `[x]` | Decided |

---

## Phase 1 — Project Foundation (Day 1)

| Task | Status | Notes |
|------|--------|-------|
| `npx create-next-app@latest stromvei` with TypeScript + Tailwind | `[x]` | Scaffolded manually (existing files in dir) — Next.js 16.2.6 |
| Configure `tsconfig.json` strict mode | `[x]` | |
| Install dependencies: maplibre-gl, @turf/turf, @supabase/ssr, @supabase/supabase-js | `[x]` | autoprefixer also installed |
| Set up `.env.local` with all API keys | `[x]` | Nobil key is placeholder until email arrives |
| Commit `.env.example` with placeholder values | `[x]` | |
| Configure Tailwind with brand colours (StrømVei palette) | `[x]` | |
| Set up Supabase client files (`src/lib/supabase/client.ts`, `server.ts`) | `[x]` | |
| Set up base layout (`src/app/layout.tsx`) with Inter font | `[x]` | |
| Create i18n strings files (`no.ts`, `en.ts`) with initial keys | `[x]` | Already existed from prior session |
| Initial Vercel deploy (blank app) | `[x]` | Live at https://stromvei-project.vercel.app |

---

## Phase 2 — Map & Station Data (Days 2–3)

| Task | Status | Notes |
|------|--------|-------|
| Create `Map.tsx` component with MapLibre GL JS | `[x]` | Centred on Norway, OpenFreeMap tiles |
| Integrate Nobil API proxy route (`/api/nobil/stations`) | `[x]` | 15-min module-level cache; mock fallback when key is placeholder |
| Parse Nobil response to `NobilStation[]` type | `[x]` | Defensive parsing in `src/lib/nobil.ts` |
| Load stations on page mount via `useStations` hook | `[x]` | |
| Render stations as clustered GeoJSON source+layer | `[x]` | GeoJSON cluster source, 3 layers (cluster, count, unclustered) |
| Individual marker style at high zoom | `[x]` | Colour by speed: blue >50kW, green ≥22kW, grey <22kW |
| Click marker → show `StationDrawer` with full details | `[x]` | Slide-in right panel desktop / bottom sheet mobile |
| `StationDrawer` shows: name, address, connectors, speed, network, hours | `[x]` | |
| Connector type badges (`CCS`, `CHAdeMO`, `Type 2`, `Tesla`) | `[x]` | Colour-coded badges |
| Speed badges (`< 22 kW`, `22–50 kW`, `> 50 kW`) | `[x]` | Labels: Normallading / Hurtiglading / Lynlading |

---

## Phase 3 — Filters (Day 4)

| Task | Status | Notes |
|------|--------|-------|
| Build `FilterPanel` component (desktop sidebar) | `[ ]` | |
| Build `FilterSheet` component (mobile bottom sheet) | `[ ]` | |
| Filter: charging speed (slow / fast / rapid) — checkboxes | `[ ]` | |
| Filter: connector type (CCS / CHAdeMO / Type 2 / Tesla) — checkboxes | `[ ]` | |
| Filter: network operator — multiselect (Recharge, IONITY, Tesla, Circle K, etc.) | `[ ]` | Populate from Nobil data dynamically |
| Wire filters to `useFilters` hook | `[ ]` | |
| Filtered stations update map markers in real time | `[ ]` | |
| Station count shown in filter panel ("Viser 847 stasjoner") | `[ ]` | |
| Reset filters button | `[ ]` | |

---

## Phase 4 — Auth + Saved Places (Days 5–6)

| Task | Status | Notes |
|------|--------|-------|
| Supabase database tables created (`saved_stations`, `saved_routes`) | `[ ]` | See TECH-SPEC.md for SQL |
| Row Level Security policies applied | `[ ]` | |
| `AuthProvider` wrapping app (Supabase session context) | `[ ]` | |
| `AuthButton` component (Sign in with Google / Sign out) | `[ ]` | |
| Google OAuth configured in Supabase dashboard | `[ ]` | |
| "Save station" button in `StationDrawer` (only when logged in) | `[ ]` | |
| Save station to Supabase `saved_stations` | `[ ]` | |
| `/saved` page: list of saved stations | `[ ]` | Auth-gated, redirect to home if not signed in |
| Saved station card: click → fly to station on map | `[ ]` | |
| Remove saved station | `[ ]` | |
| `useSavedPlaces` hook | `[ ]` | |

---

## Phase 5 — Mobile + Language (Day 7)

| Task | Status | Notes |
|------|--------|-------|
| Mobile layout: full-screen map, bottom sheet for filters | `[ ]` | |
| Bottom navigation bar on mobile (Map / Saved / About) | `[ ]` | |
| `LanguageToggle` component (NO / EN) | `[ ]` | Stored in localStorage |
| All UI strings switch language when toggled | `[ ]` | |
| Test on iPhone viewport (375px wide) | `[ ]` | |
| Test on Android viewport (360px wide) | `[ ]` | |
| First Vercel deploy with all Phase 1–5 features | `[ ]` | |

**Milestone 2 checkpoint:** ✅ when all Phase 2–5 tasks are done and deployed.

---

## Phase 6 — Route Planner Core (Days 8–9)

| Task | Status | Notes |
|------|--------|-------|
| `AddressSearch` component using Nominatim | `[ ]` | Filtered to Norway (`countrycodes=no`), debounced |
| `RoutePlannerForm` component: origin, destination, range (km), min charge % | `[ ]` | |
| OSRM proxy route (`/api/route`) | `[ ]` | Proxies router.project-osrm.org, converts to GeoJSON |
| Draw route on map as Mapbox line layer | `[ ]` | |
| `RouteLayer` component | `[ ]` | |
| Install + configure Turf.js | `[ ]` | |
| `filterStationsAlongRoute()` function: stations within 5km of route | `[ ]` | Uses Turf `nearestPointOnLine` |
| Web Worker for route + station geospatial calculation | `[ ]` | Prevent UI block on large routes |

---

## Phase 7 — Route Planner Algorithm (Days 10–11)

| Task | Status | Notes |
|------|--------|-------|
| Implement greedy charging stop algorithm in `src/lib/route-planner.ts` | `[ ]` | See TECH-SPEC.md for pseudocode |
| Handle: `no_station_in_range` error case | `[ ]` | Show user-friendly message |
| Handle: `destination_unreachable` error case | `[ ]` | Show user-friendly message |
| Render suggested stops as distinct markers on map | `[ ]` | Different colour/icon from regular stations |
| `RoutePlannerResults` component: ordered list of stops | `[ ]` | Each stop shows: name, distance from prev, connector type |
| "Save route" button for logged-in users | `[ ]` | Saves to `saved_routes` table |
| Show saved routes in `/saved` page | `[ ]` | |
| Test route: Oslo → Bergen (500km, range 300km) | `[ ]` | Should suggest 1–2 stops |
| Test route: Oslo → Tromsø (1,750km, range 300km) | `[ ]` | Should suggest 5–7 stops |
| Test route: short trip within range (no stops needed) | `[ ]` | Should say "No charging stop needed" |

---

## Phase 8 — Polish & Production (Days 12–14)

| Task | Status | Notes |
|------|--------|-------|
| Loading skeleton for map while Nobil data fetches | `[ ]` | |
| Error boundary: Nobil API down → show cached/last-known data | `[ ]` | |
| Error boundary: Mapbox token invalid → clear error message | `[ ]` | |
| `About` page: project description, Nobil API credit, open source link | `[ ]` | |
| Open Graph meta tags (og:title, og:image, og:description) | `[ ]` | |
| Favicon + PWA manifest | `[ ]` | |
| No console errors in production build | `[ ]` | |
| `npm run build` passes without TypeScript errors | `[ ]` | |
| Vercel production deployment | `[ ]` | |
| `.env.example` committed with all required keys documented | `[ ]` | |
| README complete (see PLAN.md README checklist) | `[ ]` | |
| TECH-SPEC.md updated with any deviations from plan | `[ ]` | |
| All PROJECT-TRACKER tasks checked | `[ ]` | |

**Milestone 4 checkpoint:** ✅ when all Phase 6–8 tasks done and live on Vercel.

---

## Phase 9 — Post-Launch

| Task | Status | Notes |
|------|--------|-------|
| GitHub repo set to public | `[ ]` | |
| Repo pinned on github.com/adyelmoro | `[ ]` | |
| Add live URL to CV Projects section | `[ ]` | |
| LinkedIn post published | `[ ]` | See PLAN.md for post idea |
| dev.to article drafted | `[ ]` | |
| Start DokumentAI project | `[ ]` | |

---

## Bugs & Issues Log

| # | Description | Status | Notes |
|---|-------------|--------|-------|
| 1 | MapLibre canvas black vertical strip — canvas width wrong at init | `[~]` | Cause: dynamic import settles after `useEffect`; Fix: `position:fixed; inset:0` outer div + RAF-deferred init + staggered resize calls. Deployed, awaiting confirm. |
| 2 | Map centred on Sweden at first boot | `[x]` | Fixed: centre changed from [15,65] to [8,62.5] then to [15,65.5] (Norway mid-point) |
