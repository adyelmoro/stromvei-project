"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { useStations } from "@/hooks/useStations";
import { useFilters } from "@/hooks/useFilters";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { useAuth } from "@/components/auth/AuthProvider";
import StationDrawer from "@/components/map/StationDrawer";
import PostcodeSearch from "@/components/map/PostcodeSearch";
import FilterPanel from "@/components/map/FilterPanel";
import AuthButton from "@/components/auth/AuthButton";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useI18n } from "@/lib/i18n/provider";
import type { NobilStation } from "@/types/nobil";

const Map = dynamic(() => import("@/components/map/Map"), { ssr: false });

export default function HomePage() {
  const { t } = useI18n();
  const { user } = useAuth();

  // Filters
  const {
    filters,
    toggleSpeed,
    toggleConnector,
    toggleNetwork,
    clearFilters,
    activeCount,
  } = useFilters();
  const [filterOpen, setFilterOpen] = useState(false);

  // Stations
  const { stations, filtered, loading, error, isMock } = useStations(filters);

  // Saved places (only active when logged in)
  const { saveStation, removeStation, isSaved } = useSavedPlaces(user);

  // Map & selected station
  const [selectedStation, setSelectedStation] = useState<NobilStation | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const handleMapReady = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);

    // Fly to a station if navigated here from /saved (?lat=X&lng=Y)
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    if (lat && lng) {
      map.flyTo({
        center: [parseFloat(lng), parseFloat(lat)],
        zoom: 14,
        speed: 1.2,
      });
      // Clean the URL without triggering a re-render
      window.history.replaceState({}, "", "/");
    }
  }, []);

  // Close filter panel when a station is opened
  const handleStationClick = useCallback((station: NobilStation) => {
    setFilterOpen(false);
    setSelectedStation(station);
  }, []);

  return (
    <>
      {/* Full-screen map — z-index 0 */}
      <Map
        stations={filtered}
        onStationClick={handleStationClick}
        onMapReady={handleMapReady}
      />

      {/* Top-left overlays */}
      {/*
        ── MOBILE top bar ─────────────────────────────────────────────────────
        Single flush row: [Filter] [Postnummer──flex-1] [NO|EN] [Auth] [Logo]
        Hidden on sm+ where we use the two-column desktop layout below.
      */}
      <div className="sm:hidden fixed top-4 left-4 right-4 flex items-center gap-1.5" style={{ zIndex: 10 }}>
        {/* Filter — icon + optional badge, square pill */}
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={[
            "flex-shrink-0 flex items-center justify-center gap-1 w-8 h-8 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm border",
            filterOpen || activeCount > 0
              ? "bg-brand-blue/20 border-brand-blue/50 text-brand-blue"
              : "bg-brand-dark/80 border-white/10 text-white/60",
          ].join(" ")}
          aria-label="Toggle filter panel"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          {activeCount > 0 && (
            <span className="bg-brand-blue text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
        </button>

        {/* Postcode — fills all remaining space between filter and right controls */}
        <div className="flex-1 min-w-0">
          <PostcodeSearch mapInstance={mapInstance} fullWidth />
        </div>

        {/* Lang toggle */}
        <LanguageToggle />

        {/* Auth */}
        <AuthButton />

        {/* Logo */}
        <div className="flex-shrink-0 bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1.5">
          <span className="text-white font-bold text-xs tracking-tight whitespace-nowrap">
            Strøm<span className="text-brand-blue font-light">Vei</span>
          </span>
        </div>
      </div>

      {/*
        ── DESKTOP left column ────────────────────────────────────────────────
        Stacked: [count + filter] then [postcode] — hidden on mobile.
      */}
      <div className="hidden sm:flex fixed top-4 left-4 flex-col gap-2" style={{ zIndex: 10 }}>
        {!loading && !error && (
          <div className="flex items-center gap-2">
            <div className="bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-1.5">
              <p className="text-white/60 text-xs">
                {t.map.stationCount(filtered.length)}
                {isMock && <span className="ml-2 text-yellow-400/70">· demo-data</span>}
              </p>
            </div>
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm border",
                filterOpen || activeCount > 0
                  ? "bg-brand-blue/20 border-brand-blue/50 text-brand-blue"
                  : "bg-brand-dark/80 border-white/10 text-white/60 hover:text-white/80 hover:border-white/20",
              ].join(" ")}
              aria-label="Toggle filter panel"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="flex items-center gap-1">
                Filter
                {activeCount > 0 && (
                  <span className="bg-brand-blue text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </span>
            </button>
          </div>
        )}
        <PostcodeSearch mapInstance={mapInstance} />
      </div>

      {/*
        ── DESKTOP right row ──────────────────────────────────────────────────
        Hidden on mobile.
      */}
      <div className="hidden sm:flex fixed top-4 right-4 items-center gap-2" style={{ zIndex: 10 }}>
        <LanguageToggle />
        <AuthButton />
        <div className="bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
          <span className="text-white font-bold text-sm tracking-tight">
            Strøm<span className="text-brand-blue font-light">Vei</span>
          </span>
        </div>
      </div>

      {/* Loading overlay */}
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

      {/* Error banner */}
      {error && (
        <div
          className="fixed top-4 left-4 right-4 bg-red-900/80 border border-red-500/30 text-red-200 text-sm rounded-lg px-4 py-2.5"
          style={{ zIndex: 10 }}
        >
          {t.system.stationsError}
        </div>
      )}

      {/* Filter panel */}
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        stations={stations}
        filteredCount={filtered.length}
        onToggleSpeed={toggleSpeed}
        onToggleConnector={toggleConnector}
        onToggleNetwork={toggleNetwork}
        onClear={clearFilters}
        activeCount={activeCount}
      />

      {/* Station detail — bottom sheet */}
      <StationDrawer
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
        saveState={
          selectedStation
            ? {
                isLoggedIn: !!user,
                isSaved: isSaved(selectedStation.id),
                onSave: () => saveStation(selectedStation),
                onRemove: () => removeStation(selectedStation.id),
              }
            : undefined
        }
      />
    </>
  );
}
