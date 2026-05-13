"use client";

import { useState, useEffect } from "react";
import type { NobilStation } from "@/types/nobil";
import type { FilterState } from "@/types/filters";

type StationsState = {
  stations: NobilStation[];
  filtered: NobilStation[];
  loading: boolean;
  error: string | null;
  isMock: boolean;
};

export function useStations(filters: FilterState): StationsState {
  const [stations, setStations] = useState<NobilStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/nobil/stations");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setStations(data.stations ?? []);
          setIsMock(data.mock ?? false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load stations");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = applyFilters(stations, filters);

  return { stations, filtered, loading, error, isMock };
}

function applyFilters(stations: NobilStation[], filters: FilterState): NobilStation[] {
  return stations.filter((s) => {
    if (filters.speeds.length > 0) {
      const hasSpeed = s.connectors.some((c) => filters.speeds.includes(c.speed));
      if (!hasSpeed) return false;
    }
    if (filters.connectors.length > 0) {
      const hasConnector = s.connectors.some((c) => filters.connectors.includes(c.type));
      if (!hasConnector) return false;
    }
    if (filters.networks.length > 0) {
      if (!filters.networks.includes(s.network)) return false;
    }
    return true;
  });
}
