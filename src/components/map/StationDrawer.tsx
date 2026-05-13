"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { NobilStation, ConnectorType } from "@/types/nobil";

type Props = {
  station: NobilStation | null;
  onClose: () => void;
};

const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  CCS: "CCS",
  CHAdeMO: "CHAdeMO",
  Type2: "Type 2",
  Tesla: "Tesla",
  Other: "Annen",
};

const CONNECTOR_COLOURS: Record<ConnectorType, string> = {
  CCS: "bg-blue-600",
  CHAdeMO: "bg-orange-500",
  Type2: "bg-green-600",
  Tesla: "bg-red-500",
  Other: "bg-gray-500",
};

const SPEED_LABELS = {
  rapid: { label: "Lynlading", colour: "text-brand-blue" },
  fast: { label: "Hurtiglading", colour: "text-brand-green" },
  slow: { label: "Normallading", colour: "text-gray-400" },
};

export default function StationDrawer({ station, onClose }: Props) {
  const { t } = useI18n();

  return (
    <>
      {/* Backdrop (mobile) */}
      {station && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={[
          "fixed z-20 bg-[#0D1527] border-l border-white/10 shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          // Desktop: right side panel
          "md:top-0 md:right-0 md:h-full md:w-96",
          station ? "md:translate-x-0" : "md:translate-x-full",
          // Mobile: bottom sheet
          "bottom-0 left-0 right-0 rounded-t-2xl md:rounded-none",
          station ? "translate-y-0" : "translate-y-full md:translate-y-0",
        ].join(" ")}
        aria-hidden={!station}
      >
        {station && (
          <div className="flex flex-col h-full max-h-[85vh] md:max-h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-white/10">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                  {station.network}
                </p>
                <h2 className="text-white font-semibold text-base leading-snug">
                  {station.name}
                </h2>
                <p className="text-white/50 text-sm mt-0.5">
                  {station.address.street && `${station.address.street}, `}
                  {station.address.city}
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
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">
                {t.station.connectorsLabel}
              </p>
              <div className="space-y-2.5">
                {station.connectors.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${CONNECTOR_COLOURS[c.type]}`}>
                        {CONNECTOR_LABELS[c.type]}
                      </span>
                      <span className={`text-sm font-medium ${SPEED_LABELS[c.speed].colour}`}>
                        {t.station.speedDisplay(c.speedKw)}
                      </span>
                    </div>
                    <StatusDot status={c.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
              <DetailRow label={t.station.operatorLabel} value={station.network} />
              {station.address.municipality && (
                <DetailRow label="Kommune" value={station.address.municipality} />
              )}
              <DetailRow
                label={t.station.hoursLabel}
                value={station.openingHours ?? t.station.alwaysOpen}
              />
              <p className="text-xs text-white/25 pt-1">{t.station.availabilityNote}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function StatusDot({ status }: { status: "available" | "occupied" | "unknown" }) {
  const colours = {
    available: "bg-green-400",
    occupied: "bg-red-400",
    unknown: "bg-gray-500",
  };
  return (
    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colours[status]}`} />
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-white/40 text-sm flex-shrink-0">{label}</span>
      <span className="text-white/80 text-sm text-right">{value}</span>
    </div>
  );
}
