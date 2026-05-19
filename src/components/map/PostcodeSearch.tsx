"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";

const NORWAY_CENTER: [number, number] = [10.0, 62.0];
const NORWAY_ZOOM = 5;

type Props = {
  mapInstance: maplibregl.Map | null;
  fullWidth?: boolean;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
};

type Suggestion = {
  city: string;
  lat: number;
  lon: number;
};

export default function PostcodeSearch({ mapInstance, fullWidth = false }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a ref to mapInstance so async callbacks always see the latest value
  const mapRef = useRef(mapInstance);
  useEffect(() => { mapRef.current = mapInstance; }, [mapInstance]);

  // ── Core lookup ──────────────────────────────────────────────────────────
  const lookup = useCallback(async (postcode: string): Promise<Suggestion | null> => {
    setStatus("loading");
    setErrorMsg("");
    setSuggestion(null);

    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=json&addressdetails=1&countrycodes=no` +
        `&postalcode=${encodeURIComponent(postcode)}&limit=1`;

      const res = await fetch(url, { headers: { "Accept-Language": "no" } });
      if (!res.ok) throw new Error("network");

      const data: NominatimResult[] = await res.json();

      if (!data.length) {
        setErrorMsg(`Fant ikke postnummer ${postcode}`);
        setStatus("error");
        return null;
      }

      const result = data[0];
      const addr = result.address;
      const city =
        addr?.city ??
        addr?.town ??
        addr?.village ??
        addr?.municipality ??
        result.display_name.split(", ")[1] ??
        "";

      const s: Suggestion = {
        city,
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
      };
      setSuggestion(s);
      setStatus("idle");
      return s;
    } catch {
      setErrorMsg("Søk feilet. Sjekk tilkoblingen din.");
      setStatus("error");
      return null;
    }
  }, []);

  // ── Fly to a resolved suggestion ─────────────────────────────────────────
  const flyTo = useCallback((s: Suggestion) => {
    mapRef.current?.flyTo({
      center: [s.lon, s.lat],
      zoom: 13,
      speed: 1.4,
    });
    setSuggestion(null);
    inputRef.current?.blur();
  }, []);

  // ── React to value changes ────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value === "") {
      // Clear → reset map to Norway overview
      mapRef.current?.flyTo({ center: NORWAY_CENTER, zoom: NORWAY_ZOOM, speed: 1.2 });
      setSuggestion(null);
      setStatus("idle");
      return;
    }

    // 1–3 digits: just wait
    if (value.length < 4) {
      setSuggestion(null);
      if (status === "error") setStatus("idle");
      return;
    }

    // Exactly 4 digits: debounced auto-lookup
    debounceRef.current = setTimeout(() => { void lookup(value); }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // `status` intentionally excluded — we only want to react to value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, lookup]);

  // ── Keyboard handling ─────────────────────────────────────────────────────
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (suggestion) {
        // Already have a resolved suggestion — fly immediately
        flyTo(suggestion);
      } else if (value.length === 4) {
        // User hit Enter before the debounce fired — cancel debounce, look up now
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const s = await lookup(value);
        if (s) flyTo(s);
      }
    }
    if (e.key === "Escape") {
      setSuggestion(null);
      setStatus("idle");
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "w-full" : "w-52"}`}>
      {/* Input row */}
      <div
        className={[
          "flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-sm border rounded-lg px-2.5 py-1.5",
          status === "error" ? "border-red-500/50" : "border-white/10",
        ].join(" ")}
      >
        {/* Pin icon */}
        <svg
          className="w-3.5 h-3.5 flex-shrink-0 text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="Postnummer"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, "").slice(0, 4));
          }}
          onKeyDown={(e) => { void handleKeyDown(e); }}
          className="flex-1 bg-transparent text-white/80 text-xs placeholder-white/30 outline-none min-w-0"
          aria-label="Søk etter postnummer"
          autoComplete="off"
        />

        {/* Right slot: spinner | clear button | search button */}
        {status === "loading" ? (
          <svg className="animate-spin w-3.5 h-3.5 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : value.length > 0 ? (
          <button
            onClick={() => setValue("")}
            className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors"
            aria-label="Tøm søk"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </div>

      {/* Suggestion chip — appears after auto-lookup resolves */}
      {suggestion && (
        <button
          onClick={() => flyTo(suggestion)}
          className={[
            "flex items-center gap-2 bg-brand-dark/90 backdrop-blur-sm",
            "border border-brand-blue/30 rounded-lg px-2.5 py-1.5",
            "text-left hover:border-brand-blue/60 hover:bg-brand-blue/10 transition-colors",
            "group",
          ].join(" ")}
        >
          <span className="text-white/40 text-xs font-mono flex-shrink-0">{value}</span>
          <span className="text-white/80 text-xs truncate group-hover:text-white transition-colors">
            {suggestion.city}
          </span>
          <svg className="w-3 h-3 text-brand-blue/60 flex-shrink-0 ml-auto group-hover:text-brand-blue transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Error */}
      {status === "error" && (
        <p className="text-red-400/80 text-xs px-1">{errorMsg}</p>
      )}
    </div>
  );
}
