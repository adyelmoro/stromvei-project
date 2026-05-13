# StrømVei — Product Context & Pitch
**An open-source EV charging map and route planner for Norway**

---

## The Problem

Norway has the highest EV adoption rate in the world. As of 2025, over 25% of all registered cars are electric, and that number continues to grow. The infrastructure to support this has grown significantly — there are now over 10,000 public charging stations across the country.

But finding a charging station and planning a long trip around your battery range is still harder than it should be. Existing solutions have problems:

- **Charging network apps** (Recharge, IONITY, Tesla) only show their own network
- **Google Maps and Apple Maps** show stations but cannot plan charging stops based on your specific car range
- **Nobil.no** (the official database) has a map, but it is not designed for route planning

StrømVei solves this by combining all Norwegian charging data (from Nobil, the national database) with smart routing — tell it your car's range, and it finds the optimal places to stop on your journey.

---

## The Solution

StrømVei is a single-page web app that:

1. **Shows all ~10,000 charging stations** in Norway on an interactive map — from every network, in one place
2. **Filters by what you need** — connector type (CCS, CHAdeMO, Type 2, Tesla), charging speed, network operator
3. **Plans your route intelligently** — enter A and B, set your car's range, and get a list of where to stop to arrive without running out of charge
4. **Remembers your favourites** — sign in with Google to save frequently used stations and planned routes

---

## Why This Exists

StrømVei was built as an open-source portfolio project by Ayyad Anwar, a full-stack developer based in Skien, Norway. The project demonstrates:

- Working with the Norwegian Nobil API — a government-backed open dataset
- Real-world geospatial problem solving (routing algorithm, corridor filtering, Turf.js)
- Mapbox GL JS at scale (10,000 data points, clustering, custom layers)
- Full-stack Next.js 15 + TypeScript + Supabase development
- Building for a real Norwegian use case, in Norwegian and English

The code is open source. The data is open. The tool is free to use.

---

## Market Context

**Norway EV stats (2025):**
- 25%+ of all registered cars are electric
- ~10,000 public charging stations (Nobil database)
- Target: 100% new car sales electric by 2025 (nearly achieved)
- EV charging is a national infrastructure priority

**Who uses this:**
- Any Norwegian EV driver planning a long trip
- Norway sees ~750,000 domestic road trips per month in summer
- Tourists renting EVs in Norway (a growing segment)

**Comparable products:**
- PlugShare (USA-focused, not optimised for Norway)
- ABRP (A Better Route Planner) — exists, but StrømVei is open source, Norway-first, and built on official government data
- Nobil.no official map — data source only, not a route planner

---

## Potential Future Directions (Beyond Portfolio Scope)

This section exists to show product thinking — these are NOT built in v1.

**If StrømVei were a real product:**
- **Real-time connector availability** via Nobil's live API endpoints
- **Car database** — select your exact car model for automatic range pre-fill
- **Charging time estimates** — calculate how long you'll need at each stop
- **Community reports** — upvote working stations, flag broken ones
- **Progressive Web App / offline map** — cache your planned route for when you're driving without signal
- **Integration with EV navigation apps** (export route to ABRP, Google Maps)

**Potential revenue model (if commercial):**
- Free base product
- Premium: save unlimited routes, offline maps, real-time availability alerts
- B2B: API access for fleet managers (monthly subscription)
- Sponsored placement for charging networks (clearly labelled)

---

## Technical Credibility

**Why this project is non-trivial:**

1. **Geospatial at scale** — 10,000 points rendered performantly using Mapbox cluster layers, not React components
2. **Route planning algorithm** — greedy algorithm with Turf.js geospatial operations, running in a Web Worker to avoid UI blocking
3. **Norwegian API** — Nobil is not documented in English. Understanding and integrating it requires navigating Norwegian documentation
4. **Caching strategy** — Nobil data proxied and cached server-side to avoid rate limits and reduce latency
5. **Full-stack** — Next.js API routes as backend, Supabase for auth + persistence, Vercel for deployment

---

## Open Source Details

**License:** MIT — free to use, modify, and distribute

**Contributions welcome:**
- Adding more Norwegian language strings
- Improving the route planner algorithm
- Adding connector type icons
- Performance optimisations

**Data credits:**
- Station data: Nobil (nobil.no) — Norwegian government EV infrastructure database
- Map tiles: Mapbox
- Routing: Mapbox Directions API
- Geospatial calculations: Turf.js

---

*StrømVei is a portfolio project by Ayyad Anwar. Not affiliated with Nobil, Mapbox, or any charging network operator.*
