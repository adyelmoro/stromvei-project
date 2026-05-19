"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { POSTCODES } from "@/data/postcodes";

const NORWAY_CENTER: [number, number] = [10.0, 62.0];
const NORWAY_ZOOM = 5;
const MAX_RESULTS = 8;
const MIN_DIGITS = 2; // show dropdown from 2 digits

type Props = {
  mapInstance: maplibregl.Map | null;
  fullWidth?: boolean;
  onReset?: () => void;
  /** Called when the input receives focus — lets the parent close competing panels */
  onFocus?: () => void;
};

type PostcodeMatch = [string, string]; // [code, city]

export default function PostcodeSearch({ mapInstance, fullWidth = false, onReset, onFocus }: Props) {
  const [value, setValue] = useState("");
  const [matches, setMatches] = useState<PostcodeMatch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // stable ref so async callbacks always see the latest mapInstance
  const mapRef = useRef(mapInstance);
  useEffect(() => { mapRef.current = mapInstance; }, [mapInstance]);

  // ── Filter postcode list as user types ────────────────────────────────────
  useEffect(() => {
    if (value.length < MIN_DIGITS) {
      setMatches([]);
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }
    const filtered = POSTCODES.filter(([code]) => code.startsWith(value)).slice(0, MAX_RESULTS);
    setMatches(filtered);
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(-1);
  }, [value]);

  // ── Nominatim coordinate lookup for a confirmed postcode ──────────────────
  const flyToPostcode = useCallback(async (postcode: string) => {
    setStatus("loading");
    setErrorMsg("");
    setIsOpen(false);
    setHighlightedIndex(-1);

    try {
      // Proxy through our API route — avoids CSP and Nominatim rate limits
      const url = `/api/geocode?postalcode=${encodeURIComponent(postcode)}&limit=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("network");

      const data = await res.json() as Array<{ lat: string; lon: string }>;
      if (!data.length) {
        setErrorMsg(`Fant ikke postnummer ${postcode}`);
        setStatus("error");
        return;
      }

      mapRef.current?.flyTo({
        center: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
        zoom: 13,
        speed: 1.4,
      });
      inputRef.current?.blur();
      setStatus("idle");
    } catch {
      setErrorMsg("Søk feilet. Sjekk tilkoblingen din.");
      setStatus("error");
    }
  }, []);

  // ── Auto-fly when exactly 4 digits are typed ──────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value === "") {
      mapRef.current?.flyTo({ center: NORWAY_CENTER, zoom: NORWAY_ZOOM, speed: 1.2 });
      setStatus("idle");
      return;
    }

    if (value.length === 4) {
      debounceRef.current = setTimeout(() => { void flyToPostcode(value); }, 250);
    }

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, flyToPostcode]);

  // ── Select an item from the dropdown ──────────────────────────────────────
  const selectMatch = useCallback((code: string) => {
    setValue(code);
    setIsOpen(false);
    void flyToPostcode(code);
  }, [flyToPostcode]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        if (!isOpen) break;
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, matches.length - 1));
        break;
      case "ArrowUp":
        if (!isOpen) break;
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          selectMatch(matches[highlightedIndex][0]);
        } else if (value.length === 4) {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          void flyToPostcode(value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, matches, highlightedIndex, value, selectMatch, flyToPostcode]);

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current?.contains(e.target as Node) === false &&
        inputRef.current?.contains(e.target as Node) === false
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const borderClass = status === "error"
    ? "border-red-500/50"
    : isOpen ? "border-white/20" : "border-white/10";

  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-52"}`}>
      {/* Input row */}
      <div className={`flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-sm border rounded-lg px-2.5 py-1.5 ${borderClass}`}>
        {/* Pin icon */}
        <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        {/*
          text-base (16px) on mobile prevents iOS Safari from auto-zooming on
          focus — iOS zooms when font-size < 16px. sm:text-xs reverts to 12px
          on desktop where zoom behaviour doesn't apply.
        */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          placeholder="Postnummer"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (matches.length > 0) setIsOpen(true); onFocus?.(); }}
          className="flex-1 bg-transparent text-white/80 placeholder-white/30 outline-none min-w-0 text-base sm:text-xs"
          aria-label="Søk etter postnummer"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          autoComplete="off"
        />

        {/* Right slot: spinner | clear button | search icon */}
        {status === "loading" ? (
          <svg className="animate-spin w-3.5 h-3.5 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : value.length > 0 ? (
          <button
            onClick={() => { setValue(""); setIsOpen(false); setStatus("idle"); onReset?.(); }}
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

      {/* Dropdown list */}
      {isOpen && matches.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-[#0D1527] border border-white/10 rounded-lg overflow-hidden shadow-2xl"
          style={{ zIndex: 50 }}
          role="listbox"
        >
          {matches.map(([code, city], idx) => (
            <button
              key={code}
              onClick={() => selectMatch(code)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                idx === highlightedIndex
                  ? "bg-brand-blue/15 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              ].join(" ")}
              role="option"
              aria-selected={idx === highlightedIndex}
            >
              <span className="font-mono text-xs text-brand-blue/80 flex-shrink-0 w-9 tabular-nums">
                {code}
              </span>
              <span className="text-sm truncate">{city}</span>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {status === "error" && (
        <p className="text-red-400/80 text-xs px-1 mt-1">{errorMsg}</p>
      )}
    </div>
  );
}
