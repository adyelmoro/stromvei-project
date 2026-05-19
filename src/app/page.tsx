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

// MapLibre uses browser APIs — must be loaded client-side only
const Map = dynamic(() => import("@/components/map/Map"), { ssr: false });

export default function HomePage() {
  const { t } = useI18n();
  const [filters] = useState(DEFAULT_FILTERS);
  const [selectedStation, setSelectedStation] = useState<NobilStation | null>(null);
  // State (not ref) so PostcodeSearch re-renders when map becomes ready
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const { filtered, loading, error, isMock } = useStations(filters);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  return (
    // This div hosts all overlays. Map is fixed to viewport independently.
    <div className="relative w-screen h-screen overflow-hidden" style={{ zIndex: 1 }}>
      {/* Full-screen map (fixed, z-index 0 — sits below all overlays) */}
      <Map
        stations={filtered}
        loading={loading}
        onStationClick={setSelectedStation}
        onMapReady={handleMapReady}
      />

      {/* Top-left overlay: station count + postcode search */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Station count badge */}
        {!loading && !error && (
          <div className="bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
            <p className="text-white/60 text-xs">
              {t.map.stationCount(filtered.length)}
              {isMock && (
                <span className="ml-2 text-yellow-400/70">· demo-data</span>
              )}
            </p>
          </div>
        )}

        {/* Postcode search */}
        <PostcodeSearch mapInstance={mapInstance} />
      </div>

      {/* Error banner */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-red-900/80 border border-red-500/30 text-red-200 text-sm rounded-lg px-4 py-2.5">
          {t.system.stationsError}
        </div>
      )}

      {/* Logo mark */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
          <span className="text-white font-bold text-sm tracking-tight">
            Strøm<span className="text-brand-blue font-light">Vei</span>
          </span>
        </div>
      </div>

      {/* Station detail drawer */}
      <StationDrawer
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
}
