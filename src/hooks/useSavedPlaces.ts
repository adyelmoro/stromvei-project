"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { NobilStation } from "@/types/nobil";

export type SavedStation = {
  id: string;           // UUID row id
  station_id: string;   // Nobil station id
  station_name: string;
  station_lat: number;
  station_lng: number;
  created_at: string;
};

export function useSavedPlaces(user: User | null) {
  const [savedStations, setSavedStations] = useState<SavedStation[]>([]);
  const [loading, setLoading] = useState(false);
  // Stable supabase client ref — createBrowserClient is a singleton internally
  const supabase = useRef(createClient());

  // Fetch saved stations when user changes
  useEffect(() => {
    if (!user) {
      setSavedStations([]);
      return;
    }

    setLoading(true);
    supabase.current
      .from("saved_stations")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSavedStations((data as SavedStation[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const saveStation = useCallback(
    async (station: NobilStation) => {
      if (!user) return;

      // Optimistic update
      const optimistic: SavedStation = {
        id: crypto.randomUUID(),
        station_id: station.id,
        station_name: station.name,
        station_lat: station.position.lat,
        station_lng: station.position.lng,
        created_at: new Date().toISOString(),
      };
      setSavedStations((prev) => [optimistic, ...prev]);

      const { data, error } = await supabase.current
        .from("saved_stations")
        .insert({
          user_id: user.id,
          station_id: station.id,
          station_name: station.name,
          station_lat: station.position.lat,
          station_lng: station.position.lng,
        })
        .select()
        .single();

      if (error) {
        // Roll back optimistic update on error
        setSavedStations((prev) =>
          prev.filter((s) => s.id !== optimistic.id)
        );
      } else if (data) {
        // Replace optimistic with real row (correct UUID from DB)
        setSavedStations((prev) =>
          prev.map((s) => (s.id === optimistic.id ? (data as SavedStation) : s))
        );
      }
    },
    [user]
  );

  const removeStation = useCallback(
    async (stationId: string) => {
      if (!user) return;

      // Optimistic update
      setSavedStations((prev) =>
        prev.filter((s) => s.station_id !== stationId)
      );

      await supabase.current
        .from("saved_stations")
        .delete()
        .eq("user_id", user.id)
        .eq("station_id", stationId);
    },
    [user]
  );

  const isSaved = useCallback(
    (stationId: string) =>
      savedStations.some((s) => s.station_id === stationId),
    [savedStations]
  );

  return { savedStations, loading, saveStation, removeStation, isSaved };
}
