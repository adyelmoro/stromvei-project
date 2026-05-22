"use client";

import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { bbox } from "@turf/turf";
import { stationsToGeoJSON } from "@/lib/nobil";
import type { NobilStation } from "@/types/nobil";
import type { Feature, LineString } from "geojson";

const TILE_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const CLUSTER_LAYER_ID = "clusters";
const CLUSTER_COUNT_LAYER_ID = "cluster-count";
const UNCLUSTERED_LAYER_ID = "unclustered-point";
const SOURCE_ID = "stations";
const ROUTE_SOURCE_ID = "route";
const ROUTE_CASING_LAYER_ID = "route-line-casing";
const ROUTE_LINE_LAYER_ID = "route-line";
const SUGGESTED_SOURCE_ID = "suggested-stops";
const SUGGESTED_LAYER_ID = "suggested-stop-point";
const SELECTED_SOURCE_ID = "selected-station";
const SELECTED_LAYER_ID = "selected-station-point";

type Props = {
  stations: NobilStation[];
  onStationClick: (station: NobilStation) => void;
  onMapBackgroundClick?: () => void;
  onMapReady?: (map: maplibregl.Map) => void;
  route?: Feature<LineString> | null;
  suggestedStops?: NobilStation[];
  selectedStationId?: string | null;
};

export default function Map({ stations, onStationClick, onMapBackgroundClick, onMapReady, route, suggestedStops = [], selectedStationId = null }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stationsRef = useRef<NobilStation[]>([]);
  stationsRef.current = stations;
  // Keep latest callback in a ref so the stable handleMapClick doesn't go stale
  const onMapBackgroundClickRef = useRef(onMapBackgroundClick);
  onMapBackgroundClickRef.current = onMapBackgroundClick;

  // Single unified map click handler:
  //  • cluster click  → zoom in
  //  • station click  → open drawer
  //  • empty map click → close drawer
  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      const map = mapRef.current;
      if (!map) return;

      // 1. Cluster?
      const clusterFeatures = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER_ID] });
      if (clusterFeatures.length) {
        const props = clusterFeatures[0].properties;
        const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
        const coords = (clusterFeatures[0].geometry as GeoJSON.Point).coordinates as [number, number];
        source.getClusterExpansionZoom(props?.cluster_id)
          .then((zoom) => { map.easeTo({ center: coords, zoom: zoom ?? 12 }); })
          .catch(() => { map.easeTo({ center: coords, zoom: 12 }); });
        return;
      }

      // 2. Individual station or suggested stop?
      const stationFeatures = map.queryRenderedFeatures(e.point, {
        layers: [UNCLUSTERED_LAYER_ID, SUGGESTED_LAYER_ID, SELECTED_LAYER_ID],
      });
      if (stationFeatures.length) {
        const props = stationFeatures[0].properties;
        const station = stationsRef.current.find((s) => s.id === props?.id);
        if (station) onStationClick(station);
        return;
      }

      // 3. Empty map → close drawer
      onMapBackgroundClickRef.current?.();
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
      // Route source is initialised here with empty data and updated via
      // setData() — this is ~100× faster than remove-and-recreate and means
      // the blue line appears on the very next animation frame.
      // Route layers are added BEFORE station layers so they render below dots.
      map.addSource(ROUTE_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addLayer({
        id: ROUTE_CASING_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#ffffff", "line-width": 8, "line-opacity": 0.4 },
      });
      map.addLayer({
        id: ROUTE_LINE_LAYER_ID,
        type: "line",
        source: ROUTE_SOURCE_ID,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#0066FF", "line-width": 5, "line-opacity": 1.0 },
      });

      // Station source + layers
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

      // ── Suggested stop markers (algorithm result) ─────────────────────
      // Rendered on top of regular station circles as amber dots.
      map.addSource(SUGGESTED_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: SUGGESTED_LAYER_ID,
        type: "circle",
        source: SUGGESTED_SOURCE_ID,
        paint: {
          "circle-color": "#F59E0B",
          "circle-radius": 10,
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 1.0,
        },
      });

      // ── Selected station highlight ─────────────────────────────────────
      // Rendered on top of everything: white fill + blue ring so the open
      // drawer's station is unambiguously visible regardless of its speed tier.
      map.addSource(SELECTED_SOURCE_ID, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: SELECTED_LAYER_ID,
        type: "circle",
        source: SELECTED_SOURCE_ID,
        paint: {
          "circle-color": "#ffffff",
          "circle-radius": 11,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#0066FF",
          "circle-opacity": 1.0,
        },
      });

      map.on("mouseenter", CLUSTER_LAYER_ID,    () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", CLUSTER_LAYER_ID,    () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", UNCLUSTERED_LAYER_ID, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", UNCLUSTERED_LAYER_ID, () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", SUGGESTED_LAYER_ID,  () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", SUGGESTED_LAYER_ID,  () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", SELECTED_LAYER_ID,   () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", SELECTED_LAYER_ID,   () => { map.getCanvas().style.cursor = ""; });
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
    if (map.isStyleLoaded()) update(); else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [stations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const wire = () => { map.on("click", handleMapClick); };
    if (map.isStyleLoaded()) wire(); else map.on("load", wire);
    return () => { map.off("click", handleMapClick); };
  }, [handleMapClick]);

  // ── Suggested stop markers ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const src = map.getSource(SUGGESTED_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (src) src.setData(stationsToGeoJSON(suggestedStops));
    };
    if (map.isStyleLoaded()) update(); else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [suggestedStops]);

  // ── Selected station highlight ───────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const src = map.getSource(SELECTED_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (!src) return;
      if (!selectedStationId) {
        src.setData({ type: "FeatureCollection", features: [] });
        return;
      }
      const station = stationsRef.current.find((s) => s.id === selectedStationId);
      if (!station) {
        src.setData({ type: "FeatureCollection", features: [] });
        return;
      }
      src.setData({
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          geometry: { type: "Point", coordinates: [station.position.lng, station.position.lat] },
          properties: { id: station.id },
        }],
      });
    };
    if (map.isStyleLoaded()) update(); else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [selectedStationId]);

  // ── Route data ───────────────────────────────────────────────────────────
  // Route source is persistent (initialised in load handler). We just swap
  // its data — setData() is a single GPU upload and renders on the next frame
  // instead of the seconds-long remove-source → add-source → re-tile cycle.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const EMPTY_FC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

    const update = () => {
      const src = map.getSource(ROUTE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (!src) return;
      src.setData(route ?? EMPTY_FC);
      if (route) {
        try {
          const [minLng, minLat, maxLng, maxLat] = bbox(route);
          map.fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { padding: 80, maxZoom: 13, duration: 400 }
          );
        } catch { /* malformed geometry — skip */ }
      }
    };

    if (map.isStyleLoaded()) update(); else map.once("idle", update);
    return () => { map.off("idle", update); };
  }, [route]);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 0 }}
    />
  );
}
