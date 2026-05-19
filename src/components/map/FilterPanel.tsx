"use client";

import { useMemo } from "react";
import { useI18n } from "@/lib/i18n/provider";
import type { ChargeSpeed, ConnectorType, NobilStation } from "@/types/nobil";
import type { FilterState } from "@/types/filters";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  stations: NobilStation[];
  filteredCount: number;
  onToggleSpeed: (speed: ChargeSpeed) => void;
  onToggleConnector: (connector: ConnectorType) => void;
  onToggleNetwork: (network: string) => void;
  onClear: () => void;
  activeCount: number;
};

const SPEED_OPTIONS: { value: ChargeSpeed; labelKey: "speedSlow" | "speedFast" | "speedRapid"; colour: string }[] = [
  { value: "slow",  labelKey: "speedSlow",  colour: "bg-gray-500" },
  { value: "fast",  labelKey: "speedFast",  colour: "bg-brand-green" },
  { value: "rapid", labelKey: "speedRapid", colour: "bg-brand-blue" },
];

const CONNECTOR_OPTIONS: { value: ConnectorType; label: string; colour: string }[] = [
  { value: "CCS",     label: "CCS",     colour: "bg-blue-600" },
  { value: "CHAdeMO", label: "CHAdeMO", colour: "bg-orange-500" },
  { value: "Type2",   label: "Type 2",  colour: "bg-green-600" },
  { value: "Tesla",   label: "Tesla",   colour: "bg-red-500" },
];

export default function FilterPanel({
  isOpen,
  onClose,
  filters,
  stations,
  filteredCount,
  onToggleSpeed,
  onToggleConnector,
  onToggleNetwork,
  onClear,
  activeCount,
}: Props) {
  const { t } = useI18n();

  // Build sorted network list dynamically from station data
  const networkOptions = useMemo(() => {
    const seen = new Set<string>();
    stations.forEach((s) => { if (s.network) seen.add(s.network); });
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [stations]);

  return (
    <>
      {/* Backdrop — mobile only (< sm), desktop panel is floating and doesn't need it */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 sm:hidden"
          style={{ zIndex: 25 }}
          onClick={onClose}
        />
      )}

      {/* Panel
          Mobile  (< sm): full-width bottom sheet, slides up from bottom
          Desktop (sm+):  floating card bottom-left, limited width, also slides up
      */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0",
          "sm:bottom-4 sm:left-4 sm:right-auto sm:w-80 sm:rounded-2xl",
          "bg-[#0D1527] border border-white/10 shadow-2xl rounded-t-2xl",
          "transition-transform duration-300 ease-in-out",
          "overflow-y-auto",
          isOpen ? "translate-y-0" : "translate-y-[110%]",
        ].join(" ")}
        style={{ zIndex: 30, maxHeight: "80vh" }}
        // Prevent clicks inside from closing via backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile visual cue) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold text-sm">{t.filters.title}</h2>
            {activeCount > 0 && (
              <span className="bg-brand-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="text-brand-blue text-xs hover:text-blue-300 transition-colors"
              >
                {t.filters.clearButton}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Lukk filter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Charging speed */}
          <FilterSection label={t.filters.speedLabel}>
            {SPEED_OPTIONS.map(({ value, labelKey, colour }) => (
              <FilterCheckbox
                key={value}
                checked={filters.speeds.includes(value)}
                onChange={() => onToggleSpeed(value)}
                colour={colour}
                label={t.filters[labelKey]}
              />
            ))}
          </FilterSection>

          {/* Connector type */}
          <FilterSection label={t.filters.connectorLabel}>
            {CONNECTOR_OPTIONS.map(({ value, label, colour }) => (
              <FilterCheckbox
                key={value}
                checked={filters.connectors.includes(value)}
                onChange={() => onToggleConnector(value)}
                colour={colour}
                label={label}
              />
            ))}
          </FilterSection>

          {/* Network — only shown when we have data */}
          {networkOptions.length > 0 && (
            <FilterSection label={t.filters.networkLabel}>
              {networkOptions.map((network) => (
                <FilterCheckbox
                  key={network}
                  checked={filters.networks.includes(network)}
                  onChange={() => onToggleNetwork(network)}
                  label={network}
                />
              ))}
            </FilterSection>
          )}
        </div>

        {/* Footer: station count */}
        <div className="px-5 py-3 border-t border-white/10 pb-6 sm:pb-3">
          <p className="text-white/50 text-xs text-center">
            {t.map.stationCount(filteredCount)}
          </p>
        </div>
      </div>
    </>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-white/40 uppercase tracking-widest mb-2.5">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  checked,
  onChange,
  label,
  colour,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  colour?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      {/* Custom checkbox */}
      <div
        className={[
          "w-4 h-4 rounded flex-shrink-0 border transition-all",
          checked
            ? "bg-brand-blue border-brand-blue"
            : "bg-transparent border-white/30 group-hover:border-white/60",
        ].join(" ")}
        onClick={onChange}
      >
        {checked && (
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
            <path d="M3.5 8l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {/* Colour dot (optional) */}
      {colour && (
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colour}`} />
      )}
      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
        {label}
      </span>
    </label>
  );
}
