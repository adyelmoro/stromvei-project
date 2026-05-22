import type { NobilStation, ConnectorType, ChargeSpeed } from "@/types/nobil";

const NOBIL_BASE = "https://nobil.no/api/server/";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ── Nobil attribute type IDs (within attr.conn[index][attrTypeId]) ────────────
const ATTR_CONNECTOR_TYPE = "4";   // trans: "Type 2", "CCS/Combo", "CHAdeMO" …
const ATTR_CAPACITY       = "5";   // trans: "22 kW - 400V 3-phase max 32A", "150 kW DC" …
const ATTR_CONNECTOR_ID   = "29";  // attrval: EVSE connector ID number

// ── Types matching the ACTUAL Nobil datadump format ──────────────────────────
type NobilAttr = {
  attrtypeid: string;
  attrname: string;
  attrvalid: string;
  trans: string;
  attrval: unknown;
};

// Each connector entry: Record<attrtypeid, NobilAttr>
type NobilConnEntry = Record<string, NobilAttr>;

type NobilRaw = {
  csmd: {
    id: number;
    name: string;
    International_id: string;
    Position: string;         // "(lat,lng)"
    Street?: string;
    House_number?: string;
    Zipcode?: string;
    City?: string;
    Municipality?: string;
    County?: string;
    Owned_by?: string;
    Open_Hours?: string;
    Number_charging_points?: number;
  };
  attr?: {
    conn?: Record<string, NobilConnEntry>; // keyed by connector index "1","2",…
  };
};

// ── Cache ─────────────────────────────────────────────────────────────────────
type Cache = { stations: NobilStation[]; fetchedAt: number };
let cache: Cache | null = null;

// ── Helpers ───────────────────────────────────────────────────────────────────
function deriveSpeed(kw: number): ChargeSpeed {
  if (kw > 50) return "rapid";
  if (kw >= 22) return "fast";
  return "slow";
}

/**
 * Extract kW from the human-readable trans string.
 * Examples: "22 kW - 400V 3-phase max 32A" → 22
 *           "150 kW DC" → 150
 *           "62,5 kW DC" → 62.5   (European comma decimal)
 *           "400 kW DC" → 400
 */
function parseCapacityKw(trans: string): number {
  const match = trans.match(/^([\d][,.\d]*)\s*kW/i);
  if (!match) return 0;
  return parseFloat(match[1].replace(",", "."));
}

function mapConnectorType(trans: string): ConnectorType {
  const t = trans.toLowerCase();
  if (t.includes("ccs") || t.includes("combo")) return "CCS";
  if (t.includes("chademo"))                      return "CHAdeMO";
  if (t.includes("tesla"))                        return "Tesla";
  if (t.includes("type 2") || t.includes("type2")) return "Type2";
  return "Other";
}

function parsePosition(raw: string): { lat: number; lng: number } | null {
  // "(59.9139,10.7522)" or "(59.9139, 10.7522)"
  const match = raw.match(/\(([^,]+),([^)]+)\)/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

function parseStation(raw: NobilRaw): NobilStation | null {
  try {
    const pos = parsePosition(raw.csmd.Position);
    if (!pos) return null;

    // conn is Record<connectorIndex, Record<attrtypeid, NobilAttr>>
    const connObj = raw.attr?.conn ?? {};
    const connectors = Object.values(connObj)
      .map((attrs) => {
        const typeAttr     = attrs[ATTR_CONNECTOR_TYPE];
        const capacityAttr = attrs[ATTR_CAPACITY];
        const idAttr       = attrs[ATTR_CONNECTOR_ID];

        const typeName = typeAttr?.trans ?? "";
        const kw       = parseCapacityKw(capacityAttr?.trans ?? "");
        const connId   = idAttr?.attrval
          ? String(idAttr.attrval)
          : `${raw.csmd.International_id}-${typeName}`;

        return {
          id: connId,
          type: mapConnectorType(typeName),
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
        street:       [raw.csmd.Street, raw.csmd.House_number].filter(Boolean).join(" "),
        city:         raw.csmd.City         ?? "",
        postalCode:   raw.csmd.Zipcode      ?? "",
        municipality: raw.csmd.Municipality ?? "",
        county:       raw.csmd.County       ?? "",
      },
      connectors,
      network:        raw.csmd.Owned_by     ?? "Ukjent",
      openingHours:   raw.csmd.Open_Hours   ?? null,
      // fall back to csmd count so stations without parseable connectors still render
      totalConnectors: connectors.length || raw.csmd.Number_charging_points || 0,
    };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function fetchAllStations(apiKey: string): Promise<NobilStation[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.stations;
  }

  const url = `${NOBIL_BASE}datadump.php?apikey=${apiKey}&countrycode=NOR&format=json&type=2`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Nobil API error: ${res.status}`);
  }

  const json = await res.json();
  const rawStations: NobilRaw[] = Object.values(json.chargerstations ?? {});

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
        id:              s.id,
        name:            s.name,
        network:         s.network,
        totalConnectors: s.totalConnectors,
        maxSpeedKw:      Math.max(0, ...s.connectors.map((c) => c.speedKw)),
        hasRapid:        s.connectors.some((c) => c.speed === "rapid"),
        hasFast:         s.connectors.some((c) => c.speed === "fast"),
      },
    })),
  };
}
