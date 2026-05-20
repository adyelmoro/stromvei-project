"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type AddressResult = {
  lat: number;
  lon: number;
  displayName: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
};

type Props = {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onSelect: (result: AddressResult) => void;
  onClear?: () => void;
  /** Open the dropdown upward — use when the input is near the bottom of the screen */
  dropUp?: boolean;
};

/** Format a Nominatim result as a short, readable address */
function formatAddress(r: NominatimResult): string {
  const a = r.address;
  if (!a) return r.display_name.split(",").slice(0, 2).join(",").trim();
  const parts: string[] = [];
  if (a.road) parts.push(a.house_number ? `${a.road} ${a.house_number}` : a.road);
  const city = a.city ?? a.town ?? a.village ?? a.municipality ?? "";
  if (city) parts.push(city);
  return parts.join(", ") || r.display_name.split(",")[0];
}

export default function AddressSearch({ placeholder, value, onChange, onSelect, onClear, dropUp = false }: Props) {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Prevents the debounced search from re-firing right after the user picks a suggestion
  const justSelectedRef = useRef(false);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    try {
      // Route through our server-side proxy — avoids CSP and Nominatim rate limits
      const url = `/api/geocode?q=${encodeURIComponent(query)}&limit=5`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data: NominatimResult[] = await res.json();
      const mapped = data.map((r) => ({
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        displayName: formatAddress(r),
      }));
      setResults(mapped);
      setIsOpen(mapped.length > 0);
      setHighlightedIndex(-1);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced lookup — fires 300 ms after the user stops typing.
  // Skip if the value was just set by handleSelect (no need to re-search the selected text).
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (justSelectedRef.current) { justSelectedRef.current = false; return; }
    if (value.length < 2) { setResults([]); setIsOpen(false); return; }
    debounceRef.current = setTimeout(() => { void search(value); }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value, search]);

  const handleSelect = useCallback(
    (result: AddressResult) => {
      justSelectedRef.current = true; // suppress the debounce search that would follow
      onChange(result.displayName);
      onSelect(result);
      setIsOpen(false);
      setResults([]);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    },
    [onChange, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          if (!isOpen) break;
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          if (!isOpen) break;
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) handleSelect(results[highlightedIndex]);
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, highlightedIndex, handleSelect]
  );

  // Close dropdown on outside click
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

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-white/25 transition-colors">
        <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        {/*
          text-base (16px) on all sizes — prevents iOS Safari zoom on focus.
          Inside the route planner panel this size is visually appropriate.
        */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          className="flex-1 bg-transparent text-white/80 placeholder-white/25 outline-none min-w-0 text-sm"
          style={{ fontSize: "16px" }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {loading ? (
          <svg className="animate-spin w-3.5 h-3.5 text-white/30 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : value.length > 0 ? (
          <button
            onClick={() => { onChange(""); onClear?.(); setIsOpen(false); setResults([]); }}
            className="flex-shrink-0 text-white/25 hover:text-white/60 transition-colors"
            aria-label="Tøm felt"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className={[
            "absolute left-0 right-0 bg-[#0D1527] border border-white/10 rounded-lg overflow-hidden shadow-2xl",
            dropUp ? "bottom-full mb-1" : "top-full mt-1",
          ].join(" ")}
          style={{ zIndex: 60 }}
          role="listbox"
        >
          {results.map((result, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={[
                "w-full text-left px-3 py-2.5 text-sm transition-colors truncate",
                idx === highlightedIndex
                  ? "bg-brand-blue/15 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              ].join(" ")}
              role="option"
              aria-selected={idx === highlightedIndex}
            >
              {result.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
