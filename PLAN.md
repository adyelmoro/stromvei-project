# StrømVei — Project Plan
**EV Charging Map & Smart Route Planner for Norway**
**Developer:** Ayyad Anwar | **Start:** May 2026 | **Target Ship:** 2 weeks from start

---

## Project Summary

StrømVei (Norwegian: "Power Road" / "Current Way") is an open-source interactive map of all EV charging stations in Norway, with a smart route planner that calculates optimal charging stops based on your car's range. Built with Next.js 15, TypeScript, MapLibre GL JS, and the free Nobil API.

Norway has ~10,000 public EV charging stations and the highest EV adoption rate in the world (over 25% of all registered cars). StrømVei makes that infrastructure navigable.

**GitHub:** github.com/adyelmoro/stromvei (public, open source)
**Live URL:** TBD — stromvei.vercel.app

---

## Goals

**Primary goal:** Demonstrate React + TypeScript + Norwegian API knowledge to Norwegian recruiters.

**Secondary goals:**
- Show MapLibre GL JS proficiency (geospatial data at scale)
- Show ability to work with Norwegian government APIs (Nobil)
- Show real product thinking (route planner UX, not just a pin map)
- First deployed project in the portfolio — builds momentum

---

## Feature Scope (MVP — v1.0)

### In scope
- [ ] Interactive map of Norway showing all Nobil charging stations (~10,000 pins)
- [ ] Cluster view at zoom-out (performance — rendering 10k markers individually kills the browser)
- [ ] Filter panel: charging speed (slow / fast / rapid), connector type (CCS / CHAdeMO / Type 2 / Tesla), network operator
- [ ] Station detail drawer/popover: name, address, connectors, speeds, network, availability status, opening hours
- [ ] Smart route planner: input A, B, and car range (km) → get optimal charging stops
- [ ] Optional auth: sign in with Google (Supabase) to save favourite stations and planned routes
- [ ] Saved favourites: list of bookmarked stations
- [ ] Mobile-responsive layout
- [ ] Norwegian (Bokmål) default, English toggle
- [ ] Deployed on Vercel

### Explicitly NOT in scope (v1.0)
- Real-time availability (Nobil data is not always live — not our problem to solve)
- User reviews or ratings of stations
- Navigation turn-by-turn directions
- Booking / reserving a charging spot
- EV range calculator (car database)
- Payments of any kind
- Native mobile app (that is HelseBook Mobile's role)

---

## Smart Route Planner — How It Works

The route planner is the differentiating feature. Here is the algorithm:

```
1. User inputs:
   - Origin (A): text input with Nominatim geocoder (Norwegian addresses)
   - Destination (B): text input with Nominatim geocoder
   - Car range (km): number input (e.g. 300 km)
   - Minimum charge on arrival (%): slider, default 20%

2. System:
   - Calls OSRM API to get driving route geometry (GeoJSON LineString)
   - Fetches Nobil stations within a bounding box around the route
   - Filters stations by connector type (if user specified)

3. Algorithm (greedy):
   - Start at A with full charge (= car range km)
   - Effective range = car range × (1 - minimum charge %)
   - Find all stations within effective range distance along the route
   - Pick the station furthest along the route (maximises progress per stop)
   - Set current position to that station, reset to full charge
   - Repeat until destination is reachable with remaining charge
   - If no station found within range: display warning "No charging station found within range — consider a car with longer range or change filters"

4. Output:
   - Route drawn on map with charging stops highlighted
   - Sidebar list: Stop 1 (station name, address, distance from prev stop, connectors available)
   - Estimated total driving time (from OSRM, excluding charge time)
```

**Technical notes:**
- Route geometry from OSRM API is a GeoJSON LineString
- To find stations "along the route", we project each Nobil station point onto the LineString and calculate distance from that projected point to the actual station (if within threshold, it is "on route")
- Use Turf.js for geospatial calculations (nearestPointOnLine, distance, along)
- Nobil station data is fetched on page load and cached in state (10k records are ~2MB JSON — manageable)

---

## Design Direction

**Brand:** StrømVei
**Tagline (NO):** "Din guide til lading i Norge" (Your guide to charging in Norway)
**Tagline (EN):** "Norway's EV charging map and route planner"

**Visual identity:**
- Primary colour: Electric blue `#0066FF` — energy, technology
- Secondary colour: Norwegian green `#1A7A4A` — nature, sustainability
- Accent: Lightning yellow `#FFD700` — charging, electricity
- Background: Near-white `#F8F9FA` (light mode), near-black `#0A0E1A` (dark mode — map apps look better dark)
- Typography: Inter (clean, modern, widely used in Nordic SaaS)

**Logo concept:** A lightning bolt (⚡) integrated into a road/route line. Simple, works at small sizes.

**UI style:**
- Clean and minimal — the map is the product, UI should not compete with it
- Left sidebar (desktop): filters + route planner form
- Right side: full-height map
- Bottom sheet (mobile): filters + route planner slide up from bottom
- Dark mode by default (maps look better dark), light mode toggle

**Key screens:**
1. Map home — full-screen map with station pins, filter panel visible on left
2. Station detail — right-side drawer slides in when station is clicked
3. Route planner — form panel replaces filter panel, results overlay on map
4. Saved places — auth-gated, list of favourite stations and saved routes
5. About — simple page explaining the project, Nobil API credit, open source link

---

## Milestones

### Milestone 1 — Working Map (Day 3)
**Goal:** The map loads, all Nobil stations are rendered, app is running locally.
- [ ] Next.js 15 project initialised (TypeScript, Tailwind, ESLint, Prettier)
- [ ] MapLibre GL JS integrated and rendering Norway
- [ ] Nobil API authenticated and returning station data
- [ ] All stations rendered as map markers (clustered)
- [ ] Station popover shows basic data on click
- [ ] Filter panel UI built (not yet wired to data)

**Checkpoint:** Open the app, see Norway with charging station pins. Click one and see its details.

---

### Milestone 2 — Filters + Auth (Day 7)
**Goal:** Filters work. User can sign in and save favourites.
- [ ] Filter panel fully wired: speed, connector type, network operator
- [ ] Filtering updates map markers in real time
- [ ] Station drawer shows full Nobil data (address, connectors, hours, availability)
- [ ] Supabase project created and configured
- [ ] Google Sign-In working (Supabase Auth)
- [ ] "Save station" button visible when logged in
- [ ] Saved stations stored in Supabase, shown on Saved Places page
- [ ] Mobile layout working (bottom sheet for filters on mobile)
- [ ] Basic NO/EN language toggle working

**Checkpoint:** Filter to only CCS rapid chargers. Click one. Save it to favourites. Sign out. Sign back in. Favourite is still there.

---

### Milestone 3 — Route Planner (Day 11)
**Goal:** Smart route planner works end-to-end.
- [ ] Nominatim geocoder integrated for address search (A and B inputs)
- [ ] OSRM API integration (returns route geometry)
- [ ] Turf.js integrated for geospatial calculations
- [ ] Route drawn on map when A and B selected
- [ ] Greedy algorithm implemented: finds optimal charging stops given car range
- [ ] Route planner results shown in sidebar (list of stops)
- [ ] Each suggested stop shown as special marker on map
- [ ] No-route-found edge case handled gracefully
- [ ] "Save route" option for logged-in users

**Checkpoint:** Enter Oslo → Tromsø, range 300km. Get a list of 3–4 charging stops. They are plotted on the map along the route.

---

### Milestone 4 — Production Ready (Day 14)
**Goal:** Deployed, documented, demo-ready.
- [ ] All edge cases handled (no results, API errors, slow network)
- [ ] Loading states on all data fetches
- [ ] Empty states on all lists
- [ ] Performance check: map handles 10k markers without lag (clustering)
- [ ] Vercel deployment live with working environment variables
- [ ] `.env.example` committed with all required keys documented
- [ ] README complete (see README checklist below)
- [ ] TECH-SPEC.md updated with final architecture
- [ ] PROJECT-TRACKER.md all tasks checked
- [ ] Mobile tested on real device or BrowserStack

**Checkpoint:** Share the Vercel URL. Map loads. Route planner works. Looks professional. No console errors.

---

## README Checklist (Required Before Done)

- [ ] App screenshot (hero image) — full desktop view with route planner active
- [ ] App screenshot — mobile view
- [ ] One-line description in Norwegian and English
- [ ] "Live Demo" button (prominent)
- [ ] Tech stack section (badges)
- [ ] "About the data" section: credits Nobil API, explains it is Norwegian government data
- [ ] "How the route planner works" section: brief algorithm explanation
- [ ] Local setup instructions: clone, install, add env vars, run
- [ ] `.env.example` reference
- [ ] "Built by" section: Ayyad Anwar, Skien Norway, portfolio context

---

## Environment Variables Required

```
NOBIL_API_KEY=                    # Nobil API key (register at nobil.no)
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon key
# No Mapbox token needed — MapLibre + OpenFreeMap + OSRM + Nominatim are all free and keyless
```

---

## Post-Launch (After Vercel Deploy)

- [ ] LinkedIn post: "Built StrømVei — an open-source EV charging map for Norway. Here's how the route planner algorithm works. [link]"
- [ ] dev.to article: "How I built a smart EV charging route planner using the Norwegian Nobil API" — technical write-up, Norwegian developer angle
- [ ] Submit to: Awesome Norway (GitHub list), Norwegian developer communities
- [ ] Update CV: add StrømVei to Projects section with live URL

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Nobil API returns inconsistent data | Medium | Defensive parsing, skip malformed records |
| 10k markers kills performance | High | Use MapLibre Cluster layer — built in feature |
| Route planner algorithm misses optimal path | Medium | Test with Oslo→Bergen, Oslo→Tromsø, edge cases |
| Supabase free tier limit hit during demo | Low | Stay under 500MB DB, 1GB bandwidth |
| Feature scope creep (adding real-time, reviews) | High | This document is the contract — nothing else ships in v1 |
