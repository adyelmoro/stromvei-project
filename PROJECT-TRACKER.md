# StrømVei — Project Tracker
**Format:** Kanban | **Updated:** 2026-05-20

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
| Click marker → show `StationDrawer` with full details | `[x]` | Bottom sheet slides up on click — all screen sizes |
| `StationDrawer` shows: name, address, connectors, speed, network, hours | `[x]` | |
| Connector type badges (`CCS`, `CHAdeMO`, `Type 2`, `Tesla`) | `[x]` | Colour-coded badges |
| Speed badges (`< 22 kW`, `22–50 kW`, `> 50 kW`) | `[x]` | Labels: Normallading / Hurtiglading / Lynlading |
| Postcode search overlay (Nominatim geocoding) | `[x]` | 4-digit Norwegian postcode → fly to location at zoom 13 |
| Bottom sheet layout — all screen sizes | `[x]` | Hidden on load; slides up from bottom when dot clicked; backdrop tap closes |

---

## Phase 3 — Filters (Day 4)

| Task | Status | Notes |
|------|--------|-------|
| Build `FilterPanel` component (desktop sidebar) | `[x]` | Responsive: floating card on sm+, bottom sheet on mobile |
| Build `FilterSheet` component (mobile bottom sheet) | `[x]` | Merged into FilterPanel via responsive Tailwind classes |
| Filter: charging speed (slow / fast / rapid) — checkboxes | `[x]` | Colour-coded dots: grey / green / blue |
| Filter: connector type (CCS / CHAdeMO / Type 2 / Tesla) — checkboxes | `[x]` | Colour-coded badges |
| Filter: network operator — multiselect (Recharge, IONITY, Tesla, Circle K, etc.) | `[x]` | Dynamic from station data, sorted A–Z |
| Wire filters to `useFilters` hook | `[x]` | toggleSpeed / toggleConnector / toggleNetwork / clearFilters |
| Filtered stations update map markers in real time | `[x]` | useStations(filters) re-filters on every toggle |
| Station count shown in filter panel ("Viser 847 stasjoner") | `[x]` | Footer of FilterPanel + top-left count badge both update |
| Reset filters button | `[x]` | Appears in panel header when activeCount > 0 |

---

## Phase 4 — Auth + Saved Places (Days 5–6)

| Task | Status | Notes |
|------|--------|-------|
| Supabase database tables created (`saved_stations`, `saved_routes`) | `[x]` | SQL run in Supabase dashboard 2026-05-19 |
| Row Level Security policies applied | `[x]` | RLS + policy on saved_stations |
| `AuthProvider` wrapping app (Supabase session context) | `[x]` | Context: session, user, signInWithGoogle, signOut |
| `AuthButton` component (Sign in with Google / Sign out) | `[x]` | Sign-in pill + avatar chip with dropdown |
| Google OAuth configured in Supabase dashboard | `[x]` | Google Cloud Console + Supabase providers + URL config |
| "Save station" button in `StationDrawer` (only when logged in) | `[x]` | Toggle: Lagre stasjon ↔ Lagret; hint if signed out |
| Save station to Supabase `saved_stations` | `[x]` | Optimistic update + rollback on error |
| `/saved` page: list of saved stations | `[x]` | Auth-gated, redirects to / if not signed in |
| Saved station card: click → fly to station on map | `[x]` | Vis → /?lat=&lng=, home page flies on map-ready |
| Remove saved station | `[x]` | Optimistic remove with × button |
| `useSavedPlaces` hook | `[x]` | saveStation / removeStation / isSaved |

---

## Phase 5 — Mobile + Language (Day 7)

| Task | Status | Notes |
|------|--------|-------|
| Mobile layout: full-screen map, bottom sheet for filters | `[x]` | All sheets work on mobile; overflow:hidden removed from body |
| Bottom navigation bar on mobile (Map / Saved / About) | `[x]` | sm:hidden fixed bottom nav, active icons, in root layout |
| `LanguageToggle` component (NO / EN) | `[x]` | Pill button, top-right on map + About page header |
| All UI strings switch language when toggled | `[x]` | All t.* strings react instantly; stored in localStorage |
| Test on iPhone viewport (375px wide) | `[x]` | Bottom nav + all sheets verified responsive |
| Test on Android viewport (360px wide) | `[x]` | Same as above |
| First Vercel deploy with all Phase 1–5 features | `[x]` | Live at https://stromvei-project.vercel.app |

**Milestone 2 checkpoint:** ✅ when all Phase 2–5 tasks are done and deployed.

---

## Phase 6 — Route Planner Core (Days 8–9) ✅

| Task | Status | Notes |
|------|--------|-------|
| `AddressSearch` component using Nominatim | `[x]` | Free-text search proxied through `/api/geocode`; debounced 300ms; `dropUp` prop for bottom-of-screen panels |
| `RoutePlannerPanel` component: origin, destination, range (km), min charge % | `[x]` | Mobile bottom sheet + desktop floating card; shows result summary when route active |
| OSRM proxy route (`/api/route`) | `[x]` | Proxies router.project-osrm.org, returns Feature<LineString> + distanceKm + durationMin; 1h cache |
| Nominatim geocode proxy (`/api/geocode`) | `[x]` | Server-side proxy avoids Vercel CSP; handles postalcode and free-text q; 24h cache |
| Draw route on map as MapLibre line layers | `[x]` | White casing (8px) + blue line (5px); remove/re-add on each change; idle-event fallback fixes race condition |
| `RoutePlannerContext` for BottomNav bridge | `[x]` | Context bridges page.tsx route toggle to BottomNav in layout.tsx; exposes hasActiveRoute for nav highlight |
| `filterStationsAlongRoute()` function: stations within 5km of route | `[x]` | Uses Turf `nearestPointOnLine`; `displayedStations` useMemo in page.tsx |
| Turf.js bbox for fitBounds on route | `[x]` | Map flies to route bounding box with 80px padding, maxZoom 13 |
| Route button in top nav (desktop + BottomNav mobile) | `[x]` | Desktop: button in top-left cluster; mobile: Rute tab in BottomNav |
| Postcode/filter panels close when route panel opens | `[x]` | Mutual exclusion + onFocus callback on PostcodeSearch |
| iOS keyboard zoom prevention on all inputs | `[x]` | `style={{ fontSize: "16px" }}` on all number/text inputs |
| Route line fixed — idle event fallback | `[x]` | Root cause: `isStyleLoaded()` returns false during tile fetches after user interaction; `"load"` fallback never fires again; fixed with `"idle"` |

---

## Phase 7 — Route Planner Algorithm (Days 10–11) ✅

| Task | Status | Notes |
|------|--------|-------|
| Implement greedy charging stop algorithm in `src/lib/route-planner.ts` | `[x]` | Turf.js `nearestPointOnLine` + greedy furthest-reachable approach |
| Handle: `no_station_in_range` error case | `[x]` | Amber warning banner in RoutePlannerPanel |
| Handle: `destination_unreachable` error case | `[x]` | Amber warning banner in RoutePlannerPanel |
| Render suggested stops as distinct markers on map | `[x]` | Amber circles (10px, white stroke) on SUGGESTED_SOURCE_ID layer |
| `RoutePlannerResults` component: ordered list of stops | `[x]` | Inline in RoutePlannerPanel — numbered stops with name, distance, connectors, +km from prev |
| "Save route" button for logged-in users | `[ ]` | Deferred post-MVP — `saved_routes` table created but UI not wired |
| Show saved routes in `/saved` page | `[ ]` | Deferred post-MVP |
| Test route: Oslo → Bergen (500km, range 400km/20%) | `[x]` | 1 stop: Fortum Eidfjord (~km 309) — verified working |
| Test route: short trip within range | `[x]` | "Ingen ladestopp nødvendig" green banner — verified working |
| Add corridor mock stations (Oslo–Bergen E16/Rv7) | `[x]` | 6 stations added: Hønefoss, Nesbyen, Gol, Geilo, Eidfjord, Voss |

---

## Phase 8 — Polish & Production (Days 12–14) ✅

| Task | Status | Notes |
|------|--------|-------|
| Loading skeleton for map while Nobil data fetches | `[x]` | Spinner overlay with backdrop blur (already in page.tsx) |
| Error boundary: Nobil API down → show last-known data | `[x]` | Mock fallback in useStations + error banner in page.tsx |
| Error boundary: MapLibre config → N/A | `[x]` | No token needed — MapLibre is keyless; stale Mapbox note removed |
| `About` page: project description, Nobil API credit, open source link | `[x]` | Live at /about |
| Open Graph meta tags (og:title, og:image, og:description) | `[x]` | Full OG + Twitter card in layout.tsx; og-image.svg created |
| Favicon + PWA manifest | `[x]` | favicon.svg wired; manifest.json created with theme-color + display:standalone |
| `viewport` export with theme-color | `[x]` | Exported from layout.tsx |
| No console errors in production build | `[x]` | Verified locally |
| `npm run build` passes without TypeScript errors | `[x]` | Clean build — 9 routes, 0 errors |
| Vercel production deployment | `[x]` | Auto-deploys on push to main |
| `.env.example` committed with all required keys documented | `[x]` | Already complete |
| README.md complete | `[x]` | Features, tech stack, architecture, local setup, Norwegian context |
| TECH-SPEC.md updated with deviations from plan | `[x]` | Architecture diagram, file structure, deviations table — all updated |
| All PROJECT-TRACKER tasks checked | `[x]` | This entry |

**Milestone 4 checkpoint:** ✅ when all Phase 6–8 tasks done and live on Vercel.

---

## Phase 9 — Post-Launch

| Task | Status | Notes |
|------|--------|-------|
| GitHub repo set to public | `[x]` | Already public from day 1 — github.com/adyelmoro/stromvei-project |
| Repo pinned on github.com/adyelmoro | `[ ]` | **Manual — Ayyad pins in GitHub profile settings** |
| Add live URL to CV Projects section | `[x]` | StrømVei added as first project in cv-build-may.js; docx rebuilt 2026-05-20 |
| LinkedIn post drafted | `[x]` | Draft in session notes — Ayyad publishes manually |
| dev.to article drafted | `[x]` | Draft in session notes — Ayyad publishes manually |
| Start DokumentAI project | `[ ]` | Next session |

---

## Bugs & Issues Log

| # | Description | Status | Notes |
|---|-------------|--------|-------|
| 1 | MapLibre canvas black vertical strip at non-100% browser zoom | `[x]` | Fixed: replaced manual resize logic with ResizeObserver on container div; jumpTo after 300ms forces tile refresh |
| 2 | Map centred on Sweden at first boot | `[x]` | Fixed: centre set to [10.0, 62.0] (south-central Norway) |
| 3 | Postcode search cleared value after Enter | `[x]` | Fixed: removed `setValue("")` from success handler |
| 4 | Route line never appeared on map | `[x]` | Root cause: `isStyleLoaded()` returns false during tile fetches; `map.once("load")` fallback never re-fires. Fixed: use `map.once("idle")` fallback instead. Also fixed layer ordering — `firstSymbolId` in OpenFreeMap lands below fill layers making line invisible; now uses `CLUSTER_LAYER_ID` as `beforeId`. |
| 5 | BottomNav unresponsive on mobile when panels open | `[x]` | Fixed: BottomNav z-index raised to 35 (panels were at 20–30, covering the nav) |
| 6 | Nominatim geocoding failed on Vercel (CSP) | `[x]` | Fixed: created `/api/geocode` server-side proxy; AddressSearch and PostcodeSearch both now use it |
| 7 | Address suggestion dropdown off-screen (route planner at bottom) | `[x]` | Fixed: `dropUp` prop on AddressSearch switches dropdown to `bottom-full mb-1` |
| 8 | Postcode input font changed on desktop | `[x]` | Fixed: iOS font-size workaround used responsive classes `text-base sm:text-xs` instead of overriding with inline style |
| 9 | Number input spinners overflowing route planner panel | `[x]` | Fixed: Tailwind `[appearance:textfield]` + webkit spin button suppression |
| 10 | Range/min-charge inputs overflowing panel on mobile | `[x]` | Fixed: changed from side-by-side flex row to stacked vertical layout |
