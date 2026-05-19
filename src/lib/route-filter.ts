import { nearestPointOnLine, point } from "@turf/turf";
import type { Feature, LineString } from "geojson";
import type { NobilStation } from "@/types/nobil";

/**
 * Return the subset of stations within `corridorKm` kilometres of the route.
 *
 * Uses Turf.js nearestPointOnLine to measure perpendicular distance from each
 * station to the route geometry.
 *
 * TODO: Move to a Web Worker once the real Nobil API key arrives and the
 * station count reaches thousands. For demo data (12 stations) this is instant.
 */
export function filterStationsAlongRoute(
  stations: NobilStation[],
  routeLine: Feature<LineString>,
  corridorKm = 5
): NobilStation[] {
  try {
    return stations.filter((station) => {
      const pt = point([station.position.lng, station.position.lat]);
      const nearest = nearestPointOnLine(routeLine, pt, { units: "kilometers" });
      return (nearest.properties.dist ?? Infinity) <= corridorKm;
    });
  } catch {
    // Turf error (malformed geometry) — fall back to showing all stations
    return stations;
  }
}
