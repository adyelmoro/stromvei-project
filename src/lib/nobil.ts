import type {
  NobilStation,
  NobilRawStation,
  NobilRawConnector,
  ConnectorType,
  ChargeSpeed,
} from "@/types/nobil";

const NOBIL_BASE = "https://nobil.no/api/server/";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

type Cache = {
  stations: NobilStation[];
  fetchedAt: number;
};

// Module-level cache — persists across requests within the same serverless instance
let cache: Cache | null = null;

function deriveSpeed(kw: number): ChargeSpeed {
  if (kw > 50) return "rapid";
  if (kw >= 22) return "fast";
  return "slow";
}

function mapConnectorType(typeId: string, typeName: string): ConnectorType {
  const name = typeName.toLowerCase();
  if (name.includes("ccs") || typeId === "8") return "CCS";
  if (name.includes("chademo") || typeId === "7") return "CHAdeMO";
  if (name.includes("tesla") || typeId === "11") return "Tesla";
  if (name.includes("type 2") || name.includes("type2") || typeId === "4") return "Type2";
  return "Other";
}

function parsePosition(raw: string): { lat: number; lng: number } | null {
  // Format: "(lat,lng)" e.g. "(59.9139,10.7522)"
  const match = raw.match(/\(([^,]+),([^)]+)\)/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

function parseStation(raw: NobilRawStation): NobilStation | null {
  try {
    const pos = parsePosition(raw.csmd.Position);
    if (!pos) return null;

    const connectors = (raw.attr?.conn ?? [])
      .map((c: NobilRawConnector) => {
        const kw = Number(c.chargingCapacity) || 0;
        return {
          id: String(c.connectorId),
          type: mapConnectorType(String(c.connectorTypeId), c.connectorTypeName ?? ""),
          speedKw: kw,
          speed: deriveSpeed(kw),
          status: "unknown" as const,
        };
      })
      .filter((c) => c.speedKw > 0);

    return {
      id: raw.csmd.International_id,
      name: raw.csmd.name || "Ukjent stasjon",
      position: pos,
      address: {
        street: [raw.csmd.Street, raw.csmd.House_number].filter(Boolean).join(" "),
        city: raw.csmd.City || "",
        postalCode: raw.csmd.Zipcode || "",
        municipality: raw.csmd.Municipality || "",
        county: raw.csmd.County || "",
      },
      connectors,
      network: raw.csmd.Owned_by || "Ukjent",
      openingHours: raw.csmd.Open_Hours || null,
      totalConnectors: connectors.length,
    };
  } catch {
    return null;
  }
}

export async function fetchAllStations(apiKey: string): Promise<NobilStation[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.stations;
  }

  const url = `${NOBIL_BASE}datadump.php?apikey=${apiKey}&countrycode=NOR&format=json&type=2`;
  const res = await fetch(url, { next: { revalidate: 0 } });

  if (!res.ok) {
    throw new Error(`Nobil API error: ${res.status}`);
  }

  const json = await res.json();
  const rawStations: NobilRawStation[] = Object.values(json.chargerstations ?? {});

  const stations = rawStations
    .map(parseStation)
    .filter((s): s is NobilStation => s !== null);

  cache = { stations, fetchedAt: Date.now() };
  return stations;
}

export function stationsToGeoJSON(
  stations: NobilStation[]
): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: stations.map((s) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [s.position.lng, s.position.lat],
      },
      properties: {
        id: s.id,
        name: s.name,
        network: s.network,
        totalConnectors: s.totalConnectors,
        maxSpeedKw: Math.max(0, ...s.connectors.map((c) => c.speedKw)),
        hasRapid: s.connectors.some((c) => c.speed === "rapid"),
        hasFast: s.connectors.some((c) => c.speed === "fast"),
      },
    })),
  };
}
