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

type Props = {
  stations: NobilStation[];
  loading: boolean;
  onStationClick: (station: NobilStation) => void;
  onMapReady?: (map: maplibregl.Map) => void;
};

export default function Map({ stations, loading, onStationClick, onMapReady }: Props) {
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

      const station = stationsRef.current.find((s) => s.id === props.id);
      if (station) onStationClick(station);
    },
    [onStationClick]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const container = containerRef.current;

    // Set explicit pixel dimensions before MapLibre reads offsetWidth/offsetHeight.
    // This is the most reliable approach — bypasses all CSS chain and zoom-level issues.
    const applySize = () => {
      container.style.width = window.innerWidth + "px";
      container.style.height = window.innerHeight + "px";
    };
    applySize();

    const map = new maplibregl.Map({
      container,
      style: TILE_STYLE,
      center: [10.0, 62.0], // Norway — south-central, shows all populated areas
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      map.resize();
      if (onMapReady) onMapReady(map);

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

      map.on("mouseenter", CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", CLUSTER_LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", UNCLUSTERED_LAYER_ID, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", UNCLUSTERED_LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
    });

    mapRef.current = map;

    const onWindowResize = () => {
      applySize();
      map.resize();
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update GeoJSON data when stations change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const updateData = () => {
      const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (source) source.setData(stationsToGeoJSON(stations));
    };
    if (map.isStyleLoaded()) updateData();
    else map.once("load", updateData);
  }, [stations]);

  // Wire click handlers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onLoad = () => {
      map.on("click", CLUSTER_LAYER_ID, handleClick);
      map.on("click", UNCLUSTERED_LAYER_ID, handleClick);
    };
    if (map.isStyleLoaded()) onLoad();
    else map.on("load", onLoad);
    return () => {
      map.off("click", CLUSTER_LAYER_ID, handleClick);
      map.off("click", UNCLUSTERED_LAYER_ID, handleClick);
    };
  }, [handleClick]);

  return (
    // Fixed to viewport — completely independent of parent CSS chain
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <div ref={containerRef} />
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
