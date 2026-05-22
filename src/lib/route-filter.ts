import { nearestPointOnLine, point } from "@turf/turf";
import type { Feature, LineString } from "geojson";
import type { NobilStation } from "@/types/nobil";

/**
 * Return the subset of stations within `corridorKm` kilometres of the route.
 *
 * Two-pass approach to avoid blocking the main thread with 5 000+ stations:
 *   1. Bounding-box pre-filter (O(n) arithmetic) — eliminates ~95 % of stations
 *   2. Precise nearestPointOnLine check (Turf.js) on the small candidate set only
 *
 * With real Nobil data (~5 000 stations) and a typical Norwegian route this
 * reduces the expensive Turf calls from 5 000 → ~100–300.
 */
export function filterStationsAlongRoute(
  stations: NobilStation[],
  routeLine: Feature<LineString>,
  corridorKm = 5
): NobilStation[] {
  try {
    const coords = routeLine.geometry.coordinates;

    // ── Pass 1: axis-aligned bounding box ──────────────────────────────────
    // 1 degree ≈ 111 km, so corridorKm + small buffer in degrees
    const padDeg = (corridorKm + 5) / 111;
    let minLng = Infinity, maxLng = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;
    for (const [lng, lat] of coords) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
    minLng -= padDeg; maxLng += padDeg;
    minLat -= padDeg; maxLat += padDeg;

    const candidates = stations.filter(
      (s) =>
        s.position.lng >= minLng &&
        s.position.lng <= maxLng &&
        s.position.lat >= minLat &&
        s.position.lat <= maxLat
    );

    // ── Pass 2: precise perpendicular distance (Turf) on candidates only ───
    return candidates.filter((station) => {
      const pt = point([station.position.lng, station.position.lat]);
      const nearest = nearestPointOnLine(routeLine, pt, { units: "kilometers" });
      return (nearest.properties.dist ?? Infinity) <= corridorKm;
    });
  } catch {
    // Turf error (malformed geometry) — fall back to showing all stations
    return stations;
  }
}
