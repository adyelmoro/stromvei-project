import { length, nearestPointOnLine, point } from "@turf/turf";
import type { Feature, LineString } from "geojson";
import type { NobilStation } from "@/types/nobil";

export type ChargingStop = {
  station: NobilStation;
  /** Distance along route from the trip start (km) */
  distanceFromStartKm: number;
  /** Distance from the previous stop — or from the origin for stop #1 (km) */
  distanceFromPrevKm: number;
};

export type RoutePlanResult =
  | { ok: true; stops: ChargingStop[]; noStopNeeded: boolean }
  | { ok: false; error: "no_station_in_range" | "destination_unreachable" };

/**
 * Greedy charging stop planner.
 *
 * Algorithm:
 *  1. Project every corridor station onto the route and record its km position.
 *  2. If total route length ≤ effectiveRange → no stop needed.
 *  3. From the current position, find all stations within effectiveRange km ahead.
 *     Pick the furthest one (greedy). Advance, repeat.
 *  4. Stop once the remaining distance ≤ effectiveRange (destination reachable).
 *
 * @param routeLine     GeoJSON Feature<LineString> from OSRM
 * @param stations      Stations already pre-filtered to the route corridor
 * @param carRangeKm    Real-world car range (km)
 * @param minChargePct  Minimum battery % to keep in reserve at each stop / destination
 * @param corridorKm    Max perpendicular distance to include a station (default 5 km)
 */
export function planChargingStops(
  routeLine: Feature<LineString>,
  stations: NobilStation[],
  carRangeKm: number,
  minChargePct: number,
  corridorKm = 5
): RoutePlanResult {
  // Cap minCharge at 90 % so effectiveRange is always > 0
  const effectiveRange = carRangeKm * (1 - Math.min(minChargePct, 90) / 100);
  const totalKm = length(routeLine, { units: "kilometers" });

  // Project every station onto the route line.
  // nearestPointOnLine returns `location` in the same units we pass (km here).
  const projected = stations
    .map((station) => {
      const pt = point([station.position.lng, station.position.lat]);
      const snapped = nearestPointOnLine(routeLine, pt, { units: "kilometers" });
      return {
        station,
        kmAlongRoute: snapped.properties.location ?? 0,
        distToLine: snapped.properties.dist ?? Infinity,
      };
    })
    .filter((s) => s.distToLine <= corridorKm)
    .sort((a, b) => a.kmAlongRoute - b.kmAlongRoute);

  // Whole trip fits in one charge — no stop needed
  if (totalKm <= effectiveRange) {
    return { ok: true, stops: [], noStopNeeded: true };
  }

  const stops: ChargingStop[] = [];
  let currentKm = 0;
  let prevKm = 0;

  while (totalKm - currentKm > effectiveRange) {
    // All stations that are (a) ahead of us and (b) within range
    const reachable = projected.filter(
      (s) => s.kmAlongRoute > currentKm && s.kmAlongRoute <= currentKm + effectiveRange
    );

    if (reachable.length === 0) {
      return {
        ok: false,
        // First gap → no station at all; later gap → destination unreachable
        error: stops.length === 0 ? "no_station_in_range" : "destination_unreachable",
      };
    }

    // Greedy: pick the furthest reachable station
    const best = reachable[reachable.length - 1];

    stops.push({
      station: best.station,
      distanceFromStartKm: Math.round(best.kmAlongRoute * 10) / 10,
      distanceFromPrevKm: Math.round((best.kmAlongRoute - prevKm) * 10) / 10,
    });

    prevKm = best.kmAlongRoute;
    currentKm = best.kmAlongRoute;
  }

  return { ok: true, stops, noStopNeeded: false };
}
