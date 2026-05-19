import { NextResponse } from "next/server";
import type { Feature, LineString } from "geojson";

// OSRM public API — free, no key, covers all of Norway
const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const originLat = searchParams.get("originLat");
  const originLon = searchParams.get("originLon");
  const destLat   = searchParams.get("destLat");
  const destLon   = searchParams.get("destLon");

  if (!originLat || !originLon || !destLat || !destLon) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const url =
    `${OSRM_BASE}/${originLon},${originLat};${destLon},${destLat}` +
    `?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "stromvei-app/1.0 (iamayyad@gmail.com)" },
      // Cache the route for 1 hour — same origin+dest pair returns identical road geometry
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "OSRM request failed" }, { status: 502 });
    }

    const data = await res.json() as {
      code: string;
      routes?: Array<{
        geometry: LineString;
        distance: number; // metres
        duration: number; // seconds
      }>;
    };

    if (data.code !== "Ok" || !data.routes?.length) {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }

    const osrm = data.routes[0];

    const route: Feature<LineString> = {
      type: "Feature",
      geometry: osrm.geometry,
      properties: {},
    };

    return NextResponse.json({
      route,
      distanceKm: Math.round(osrm.distance / 100) / 10,   // metres → km (1 decimal)
      durationMin: Math.round(osrm.duration / 60),          // seconds → minutes
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
