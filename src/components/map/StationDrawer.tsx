"use client";

import { useI18n } from "@/lib/i18n/provider";
import PostcodeSearch from "./PostcodeSearch";
import type { NobilStation, ConnectorType } from "@/types/nobil";
import type maplibregl from "maplibre-gl";

type Props = {
  station: NobilStation | null;
  onClose: () => void;
  stationCount: number;
  isMock: boolean;
  loading: boolean;
  mapInstance: maplibregl.Map | null;
};

const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  CCS: "CCS", CHAdeMO: "CHAdeMO", Type2: "Type 2", Tesla: "Tesla", Other: "Annen",
};
const CONNECTOR_COLOURS: Record<ConnectorType, string> = {
  CCS: "bg-blue-600", CHAdeMO: "bg-orange-500", Type2: "bg-green-600",
  Tesla: "bg-red-500", Other: "bg-gray-500",
};

export default function StationDrawer({
  station, onClose, stationCount, isMock, loading, mapInstance,
}: Props) {
  const { t } = useI18n();

  // ── Station detail content (shared between desktop sidebar + mobile sheet) ──
  const stationContent = station && (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-white/10">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{station.network}</p>
          <h2 className="text-white font-semibold text-base leading-snug">{station.name}</h2>
          <p className="text-white/50 text-sm mt-0.5">
            {station.address.street && `${station.address.street}, `}{station.address.city}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={t.station.closeButton}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Connectors */}
      <div className="p-5 border-b border-white/10">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-3">{t.station.connectorsLabel}</p>
        <div className="space-y-2.5">
          {station.connectors.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${CONNECTOR_COLOURS[c.type]}`}>
                  {CONNECTOR_LABELS[c.type]}
                </span>
                <span className={`text-sm font-medium ${
                  c.speed === "rapid" ? "text-brand-blue" :
                  c.speed === "fast"  ? "text-brand-green" : "text-gray-400"
                }`}>
                  {t.station.speedDisplay(c.speedKw)}
                </span>
              </div>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                c.status === "available" ? "bg-green-400" :
                c.status === "occupied"  ? "bg-red-400"   : "bg-gray-500"
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-white/40 text-sm flex-shrink-0">{t.station.operatorLabel}</span>
          <span className="text-white/80 text-sm text-right">{station.network}</span>
        </div>
        {station.address.municipality && (
          <div className="flex justify-between items-baseline gap-4">
            <span className="text-white/40 text-sm flex-shrink-0">Kommune</span>
            <span className="text-white/80 text-sm text-right">{station.address.municipality}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline gap-4">
          <span className="text-white/40 text-sm flex-shrink-0">{t.station.hoursLabel}</span>
          <span className="text-white/80 text-sm text-right">{station.openingHours ?? t.station.alwaysOpen}</span>
        </div>
        <p className="text-xs text-white/25 pt-1">{t.station.availabilityNote}</p>
      </div>
    </div>
  );

  // ── Empty state shown when no station is selected ────────────────────────
  const emptyState = (
    <div className="flex flex-col h-full p-5 gap-5">
      {/* Brand */}
      <div className="pt-1">
        <span className="text-white font-bold text-xl tracking-tight">
          Strøm<span className="text-brand-blue font-light">Vei</span>
        </span>
        <p className="text-white/40 text-xs mt-1">Din ladeguide for Norge</p>
      </div>

      {/* Station count */}
      {!loading && (
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <p className="text-white/60 text-xs">
            {t.map.stationCount(stationCount)}
            {isMock && <span className="ml-2 text-yellow-400/70">· demo-data</span>}
          </p>
        </div>
      )}

      {/* Postcode search */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Søk postnummer</p>
        <PostcodeSearch mapInstance={mapInstance} fullWidth />
      </div>

      {/* Hint */}
      <div className="mt-auto pb-2">
        <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
          <svg className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="text-white/40 text-xs leading-relaxed">
            Klikk på en ladestasjon på kartet for å se detaljer om kontakter, hastighet og åpningstider.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP: always-visible left sidebar ─────────────────────────── */}
      <div
        className="hidden md:flex fixed top-0 left-0 bottom-0 flex-col bg-[#0D1527] border-r border-white/10 shadow-2xl"
        style={{ width: "22rem", zIndex: 20 }}
      >
        {station ? stationContent : emptyState}
      </div>

      {/* ── MOBILE: tap-outside backdrop ─────────────────────────────────── */}
      {station && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          style={{ zIndex: 10 }}
          onClick={onClose}
        />
      )}

      {/* ── MOBILE: bottom sheet ─────────────────────────────────────────── */}
      <div
        className={[
          "md:hidden fixed bottom-0 left-0 right-0 rounded-t-2xl",
          "bg-[#0D1527] border-t border-white/10 shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          station ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ zIndex: 20, maxHeight: "85vh", overflowY: "auto" }}
      >
        {station && stationContent}
      </div>
    </>
  );
}
