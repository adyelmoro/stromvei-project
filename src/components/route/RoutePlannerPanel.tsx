"use client";

import { useState, useCallback } from "react";
import AddressSearch from "@/components/map/AddressSearch";
import type { AddressResult } from "@/components/map/AddressSearch";
import { useI18n } from "@/lib/i18n/provider";
import type { Feature, LineString } from "geojson";

export type RouteResult = {
  geojson: Feature<LineString>;
  distanceKm: number;
  durationMin: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onRouteReady: (result: RouteResult) => void;
  onRouteClear: () => void;
  activeRoute: RouteResult | null;
};

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h} t ${m} min` : `${h} t`;
}

export default function RoutePlannerPanel({
  isOpen,
  onClose,
  onRouteReady,
  onRouteClear,
  activeRoute,
}: Props) {
  const { t } = useI18n();

  const [originText, setOriginText] = useState("");
  const [originCoords, setOriginCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [destText, setDestText] = useState("");
  const [destCoords, setDestCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [rangeKm, setRangeKm] = useState("400");
  const [minChargePct, setMinChargePct] = useState("20");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOriginSelect = useCallback((r: AddressResult) => {
    setOriginCoords({ lat: r.lat, lon: r.lon });
    setError(null);
  }, []);

  const handleDestSelect = useCallback((r: AddressResult) => {
    setDestCoords({ lat: r.lat, lon: r.lon });
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!originCoords || !destCoords) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        originLat: String(originCoords.lat),
        originLon: String(originCoords.lon),
        destLat: String(destCoords.lat),
        destLon: String(destCoords.lon),
      });
      const res = await fetch(`/api/route?${params.toString()}`);
      if (!res.ok) {
        setError(t.routePlanner.errorNoRoute);
        return;
      }
      const data = (await res.json()) as {
        route: Feature<LineString>;
        distanceKm: number;
        durationMin: number;
      };
      onRouteReady({ geojson: data.route, distanceKm: data.distanceKm, durationMin: data.durationMin });
    } catch {
      setError(t.routePlanner.errorNoRoute);
    } finally {
      setLoading(false);
    }
  }, [originCoords, destCoords, onRouteReady, t]);

  const handleClear = useCallback(() => {
    setOriginText("");
    setOriginCoords(null);
    setDestText("");
    setDestCoords(null);
    setError(null);
    onRouteClear();
  }, [onRouteClear]);

  const canSubmit = !!originCoords && !!destCoords && !loading;

  const content = (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-sm">{t.routePlanner.title}</h2>
        <button
          onClick={onClose}
          className="text-white/30 hover:text-white/60 transition-colors"
          aria-label={t.station.closeButton}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {activeRoute ? (
        /* ── Result state ── */
        <div className="flex flex-col gap-3">
          {/* Route summary card */}
          <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl px-3 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 text-brand-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium">
                {activeRoute.distanceKm} km &middot; {formatDuration(activeRoute.durationMin)}
              </p>
              <p className="text-white/40 text-[11px] mt-0.5">
                {originText || "—"} → {destText || "—"}
              </p>
            </div>
          </div>

          {/* Clear route button */}
          <button
            onClick={handleClear}
            className="w-full py-2 rounded-xl border border-white/15 text-white/60 hover:text-white/80 hover:border-white/25 text-sm font-medium transition-colors"
          >
            {t.routePlanner.clearRoute}
          </button>
        </div>
      ) : (
        /* ── Form state ── */
        <div className="flex flex-col gap-2.5">
          {/* Origin */}
          <div>
            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wide mb-1">
              {t.routePlanner.originLabel}
            </label>
            <AddressSearch
              placeholder={t.routePlanner.originPlaceholder}
              value={originText}
              onChange={(text) => {
                setOriginText(text);
                if (!text) setOriginCoords(null);
              }}
              onSelect={handleOriginSelect}
              onClear={() => setOriginCoords(null)}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wide mb-1">
              {t.routePlanner.destinationLabel}
            </label>
            <AddressSearch
              placeholder={t.routePlanner.destinationPlaceholder}
              value={destText}
              onChange={(text) => {
                setDestText(text);
                if (!text) setDestCoords(null);
              }}
              onSelect={handleDestSelect}
              onClear={() => setDestCoords(null)}
            />
          </div>

          {/* Range + Min charge (side by side) */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wide mb-1">
                {t.routePlanner.rangeLabel}
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="50"
                max="1000"
                value={rangeKm}
                onChange={(e) => setRangeKm(e.target.value)}
                placeholder={t.routePlanner.rangePlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 placeholder-white/25 outline-none focus:border-white/25 transition-colors"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wide mb-1">
                {t.routePlanner.minChargeLabel}
              </label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="80"
                value={minChargePct}
                onChange={(e) => setMinChargePct(e.target.value)}
                placeholder={t.routePlanner.minChargePlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/80 placeholder-white/25 outline-none focus:border-white/25 transition-colors"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>

          {/* Range help text */}
          <p className="text-white/25 text-[11px] -mt-1">{t.routePlanner.rangeHelp}</p>

          {/* Error */}
          {error && (
            <p className="text-red-400/80 text-xs rounded-lg bg-red-900/20 border border-red-500/20 px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={[
              "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
              canSubmit
                ? "bg-brand-blue hover:bg-brand-blue/90 text-white"
                : "bg-white/5 text-white/20 cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {t.routePlanner.calculating}
              </span>
            ) : (
              t.routePlanner.submitButton
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Mobile bottom sheet ── */}
      <div
        className={[
          "sm:hidden fixed left-0 right-0 bottom-14 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
        style={{ zIndex: 20 }}
      >
        <div className="bg-[#0D1527]/95 backdrop-blur-md border-t border-white/10 rounded-t-2xl px-4 pt-3 pb-4">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
          {content}
        </div>
      </div>

      {/* ── Desktop floating card ── */}
      <div
        className={[
          "hidden sm:block fixed bottom-6 left-4 w-80 transition-all duration-300 ease-in-out",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none",
        ].join(" ")}
        style={{ zIndex: 20 }}
      >
        <div className="bg-[#0D1527]/95 backdrop-blur-md border border-white/10 rounded-2xl px-4 pt-4 pb-4 shadow-2xl">
          {content}
        </div>
      </div>
    </>
  );
}
