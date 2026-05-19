"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { useStations } from "@/hooks/useStations";
import StationDrawer from "@/components/map/StationDrawer";
import PostcodeSearch from "@/components/map/PostcodeSearch";
import { useI18n } from "@/lib/i18n/provider";
import { DEFAULT_FILTERS } from "@/types/filters";
import type { NobilStation } from "@/types/nobil";

const Map = dynamic(() => import("@/components/map/Map"), { ssr: false });

export default function HomePage() {
  const { t } = useI18n();
  const [filters] = useState(DEFAULT_FILTERS);
  const [selectedStation, setSelectedStation] = useState<NobilStation | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const { filtered, loading, error, isMock } = useStations(filters);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  return (
    <>
      {/* Map is fixed to viewport at z-index 0 */}
      <Map
        stations={filtered}
        onStationClick={setSelectedStation}
        onMapReady={handleMapReady}
      />

      {/* Loading overlay — sits above map while stations fetch */}
      {loading && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t.map.loading}
          </div>
        </div>
      )}

      {/* Top-left overlay stack */}
      <div className="fixed top-4 left-4 flex flex-col gap-2" style={{ zIndex: 10 }}>
        {!loading && !error && (
          <div className="bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
            <p className="text-white/60 text-xs">
              {t.map.stationCount(filtered.length)}
              {isMock && <span className="ml-2 text-yellow-400/70">· demo-data</span>}
            </p>
          </div>
        )}
        <PostcodeSearch mapInstance={mapInstance} />
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="fixed top-4 left-4 right-4 bg-red-900/80 border border-red-500/30 text-red-200 text-sm rounded-lg px-4 py-2.5"
          style={{ zIndex: 10 }}
        >
          {t.system.stationsError}
        </div>
      )}

      {/* Logo */}
      <div className="fixed top-4 right-4" style={{ zIndex: 10 }}>
        <div className="bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
          <span className="text-white font-bold text-sm tracking-tight">
            Strøm<span className="text-brand-blue font-light">Vei</span>
          </span>
        </div>
      </div>

      {/* Station detail drawer (z-index 20) */}
      <StationDrawer
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </>
  );
}
