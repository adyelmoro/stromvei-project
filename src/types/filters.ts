import type { ChargeSpeed, ConnectorType } from "./nobil";

export type FilterState = {
  speeds: ChargeSpeed[];
  connectors: ConnectorType[];
  networks: string[];
};

export const DEFAULT_FILTERS: FilterState = {
  speeds: [],
  connectors: [],
  networks: [],
};
