"use client";

import { useState, useCallback, useMemo } from "react";
import type { ChargeSpeed, ConnectorType } from "@/types/nobil";
import type { FilterState } from "@/types/filters";
import { DEFAULT_FILTERS } from "@/types/filters";

export type UseFiltersReturn = {
  filters: FilterState;
  toggleSpeed: (speed: ChargeSpeed) => void;
  toggleConnector: (connector: ConnectorType) => void;
  toggleNetwork: (network: string) => void;
  clearFilters: () => void;
  activeCount: number;
};

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const toggleSpeed = useCallback((speed: ChargeSpeed) => {
    setFilters((prev) => ({
      ...prev,
      speeds: prev.speeds.includes(speed)
        ? prev.speeds.filter((s) => s !== speed)
        : [...prev.speeds, speed],
    }));
  }, []);

  const toggleConnector = useCallback((connector: ConnectorType) => {
    setFilters((prev) => ({
      ...prev,
      connectors: prev.connectors.includes(connector)
        ? prev.connectors.filter((c) => c !== connector)
        : [...prev.connectors, connector],
    }));
  }, []);

  const toggleNetwork = useCallback((network: string) => {
    setFilters((prev) => ({
      ...prev,
      networks: prev.networks.includes(network)
        ? prev.networks.filter((n) => n !== network)
        : [...prev.networks, network],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeCount = useMemo(
    () =>
      filters.speeds.length +
      filters.connectors.length +
      filters.networks.length,
    [filters]
  );

  return {
    filters,
    toggleSpeed,
    toggleConnector,
    toggleNetwork,
    clearFilters,
    activeCount,
  };
}
