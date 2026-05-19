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
  onStationClick: (station: NobilStation) => void;
  onMapReady?: (map: maplibregl.Map) => void;
};

export default function Map({ stations, onStationClick, onMapReady }: Props) {
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
        source.getClusterExpansionZoom(props.cluster_id)
          .then((zoom) => { mapRef.current?.easeTo({ center: coords, zoom: zoom ?? 12 }); })
          .catch(() => { mapRef.current?.easeTo({ center: coords, zoom: 12 }); });
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

    const map = new maplibregl.Map({
      container,
      style: TILE_STYLE,
      center: [10.0, 62.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      // 1. Resize immediately after load
      map.resize();

      // 2. After first paint — catches any late CSS resolution
      requestAnimationFrame(() => { map.resize(); });

      // 3. After 300 ms — force a full tile refresh
      //    jumpTo re-issues tile requests to cover the full canvas
      setTimeout(() => {
        map.resize();
        map.jumpTo({ center: map.getCenter(), zoom: map.getZoom() });
      }, 300);

      if (onMapReady) onMapReady(map);

      // ── Sources & Layers ──────────────────────────────────────────────
      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50,
      });

      map.addLayer({
        id: CLUSTER_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step", ["get", "point_count"],
            "#0066FF", 10, "#1A7A4A", 50, "#FFD700",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 50, 40],
          "circle-opacity": 0.85,
        },
      });

      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: { "text-field": "{point_count_abbreviated}", "text-font": ["Open Sans Bold"], "text-size": 13 },
        paint: { "text-color": "#ffffff" },
      });

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

    // ResizeObserver fires whenever the container changes size — covers window
    // resize, browser zoom changes, DevTools dock/undock, and split-screen.
    // Unlike window 'resize', it doesn't pin explicit px dimensions so the
    // container naturally stretches to fill its inset-0 position at all times.
    const ro = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.resize();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const src = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (src) src.setData(stationsToGeoJSON(stations));
    };
    if (map.isStyleLoaded()) update(); else map.once("load", update);
  }, [stations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const wire = () => {
      map.on("click", CLUSTER_LAYER_ID, handleClick);
      map.on("click", UNCLUSTERED_LAYER_ID, handleClick);
    };
    if (map.isStyleLoaded()) wire(); else map.on("load", wire);
    return () => {
      map.off("click", CLUSTER_LAYER_ID, handleClick);
      map.off("click", UNCLUSTERED_LAYER_ID, handleClick);
    };
  }, [handleClick]);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 0 }}
    />
  );
}
