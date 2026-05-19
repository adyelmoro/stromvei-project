"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { NobilStation, ConnectorType } from "@/types/nobil";

type SaveState = {
  isLoggedIn: boolean;
  isSaved: boolean;
  onSave: () => Promise<void>;
  onRemove: () => Promise<void>;
};

type Props = {
  station: NobilStation | null;
  onClose: () => void;
  saveState?: SaveState;
};

const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  CCS: "CCS", CHAdeMO: "CHAdeMO", Type2: "Type 2", Tesla: "Tesla", Other: "Annen",
};
const CONNECTOR_COLOURS: Record<ConnectorType, string> = {
  CCS: "bg-blue-600", CHAdeMO: "bg-orange-500", Type2: "bg-green-600",
  Tesla: "bg-red-500", Other: "bg-gray-500",
};

export default function StationDrawer({ station, onClose, saveState }: Props) {
  const { t } = useI18n();

  return (
    <>
      {/* Tap-outside backdrop */}
      {station && (
        <div
          className="fixed inset-0 bg-black/40"
          style={{ zIndex: 15 }}
          onClick={onClose}
        />
      )}

      {/* Bottom sheet — hidden until a station is clicked, works on all screen sizes */}
      <div
        className={[
          "fixed bottom-0 left-0 right-0",
          "bg-[#0D1527] border-t border-white/10 shadow-2xl rounded-t-2xl",
          "transition-transform duration-300 ease-in-out",
          station ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ zIndex: 20, maxHeight: "80vh", overflowY: "auto" }}
      >
        {station && (
          <div>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-3 pb-4 border-b border-white/10">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{station.network}</p>
                <h2 className="text-white font-semibold text-base leading-snug">{station.name}</h2>
                <p className="text-white/50 text-sm mt-0.5">
                  {station.address.street && `${station.address.street}, `}{station.address.city}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Save button */}
                {saveState && (
                  saveState.isLoggedIn ? (
                    <button
                      onClick={() => void (saveState.isSaved ? saveState.onRemove() : saveState.onSave())}
                      className={[
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        saveState.isSaved
                          ? "bg-brand-blue/20 text-brand-blue border border-brand-blue/30 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30"
                          : "bg-white/5 text-white/50 border border-white/10 hover:bg-brand-blue/10 hover:text-brand-blue hover:border-brand-blue/30",
                      ].join(" ")}
                      aria-label={saveState.isSaved ? t.station.saveSaved : t.station.saveUnsaved}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill={saveState.isSaved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                      {saveState.isSaved ? t.station.saveSaved : t.station.saveUnsaved}
                    </button>
                  ) : (
                    <span className="text-white/30 text-xs italic">{t.station.saveSignedOut}</span>
                  )
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={t.station.closeButton}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Connectors */}
            <div className="px-5 py-4 border-b border-white/10">
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
            <div className="px-5 py-4 space-y-3 pb-8">
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-white/40 text-sm flex-shrink-0">{label}</span>
      <span className="text-white/80 text-sm text-right">{value}</span>
    </div>
  );
}
