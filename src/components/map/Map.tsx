"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { stationsToGeoJSON } from "@/lib/nobil";
import type { NobilStation } from "@/types/nobil";

const TILE_STYLE = "https://tiles.openfreemap.org/styles/liberty";

const CLUSTER_LAYER_ID = "clusters";
const CLUSTER_COUNT_LAYER_ID = "cluster-count";
const UNCLUSTERED_LAYER_ID = "unclustered-point";
const SOURCE_ID = "stations";

// Colour stations by max speed
function speedColour(maxKw: number): string {
  if (maxKw > 50) return "#0066FF"; // rapid — brand blue
  if (maxKw >= 22) return "#1A7A4A"; // fast — brand green
  return "#6B7280";                   // slow — grey
}

type Props = {
  stations: NobilStation[];
  loading: boolean;
  onStationClick: (station: NobilStation) => void;
};

export default function Map({ stations, loading, onStationClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stationsRef = useRef<NobilStation[]>([]);

  stationsRef.current = stations;

  const handleClick = useCallback(
    (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
      const features = e.features;
      if (!features?.length) return;
      const props = features[0].properties;
      if (!props) return;

      // Cluster click — zoom in
      if (props.cluster) {
        const source = mapRef.current?.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
        if (!source || !mapRef.current) return;
        const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
        source.getClusterExpansionZoom(props.cluster_id).then((zoom) => {
          mapRef.current?.easeTo({ center: coords, zoom: zoom ?? 12 });
        }).catch(() => {
          mapRef.current?.easeTo({ center: coords, zoom: 12 });
        });
        return;
      }

      // Individual station click
      const station = stationsRef.current.find((s) => s.id === props.id);
      if (station) onStationClick(station);
    },
    [onStationClick]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: TILE_STYLE,
      center: [15.0, 65.0], // Centre of Norway
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50,
      });

      // Cluster circles
      map.addLayer({
        id: CLUSTER_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step", ["get", "point_count"],
            "#0066FF", 10,
            "#1A7A4A", 50,
            "#FFD700",
          ],
          "circle-radius": [
            "step", ["get", "point_count"],
            20, 10, 30, 50, 40,
          ],
          "circle-opacity": 0.85,
        },
      });

      // Cluster count labels
      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      // Individual station dots
      map.addLayer({
        id: UNCLUSTERED_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "case",
            [">", ["get", "maxSpeedKw"], 50], "#0066FF",
            [">=", ["get", "maxSpeedKw"], 22], "#1A7A4A",
            "#6B7280",
          ],
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.9,
        },
      });

      // Cursor and click handlers
      map.on("mouseenter", CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", UNCLUSTERED_LAYER_ID, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", UNCLUSTERED_LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GeoJSON data when stations change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData(stationsToGeoJSON(stations));
  }, [stations]);

  // Wire click handler after map loads
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onLoad = () => {
      map.on("click", CLUSTER_LAYER_ID, handleClick);
      map.on("click", UNCLUSTERED_LAYER_ID, handleClick);
    };

    if (map.isStyleLoaded()) {
      onLoad();
    } else {
      map.on("load", onLoad);
    }

    return () => {
      map.off("click", CLUSTER_LAYER_ID, handleClick);
      map.off("click", UNCLUSTERED_LAYER_ID, handleClick);
    };
  }, [handleClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/60 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Henter ladestasjoner...
          </div>
        </div>
      )}
    </div>
  );
}
