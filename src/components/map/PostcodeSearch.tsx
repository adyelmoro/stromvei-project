"use client";

import { useState, useRef } from "react";
import maplibregl from "maplibre-gl";

type Props = {
  mapInstance: maplibregl.Map | null;
  fullWidth?: boolean;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export default function PostcodeSearch({ mapInstance, fullWidth = false }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidPostcode = (v: string) => /^\d{4}$/.test(v.trim());

  async function search() {
    const postcode = value.trim();
    if (!isValidPostcode(postcode)) {
      setErrorMsg("Skriv inn et 4-sifret postnummer");
      setStatus("error");
      return;
    }
    if (!mapInstance) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=json&countrycodes=no&postalcode=${encodeURIComponent(postcode)}&limit=1`;

      const res = await fetch(url, {
        headers: { "Accept-Language": "no" },
      });
      if (!res.ok) throw new Error("network");

      const data: NominatimResult[] = await res.json();

      if (!data.length) {
        setErrorMsg(`Fant ikke postnummer ${postcode}`);
        setStatus("error");
        return;
      }

      const { lat, lon } = data[0];
      mapInstance.flyTo({
        center: [parseFloat(lon), parseFloat(lat)],
        zoom: 13,
        speed: 1.4,
      });

      setStatus("idle");
      inputRef.current?.blur();
    } catch {
      setErrorMsg("Søk feilet. Sjekk tilkoblingen din.");
      setStatus("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") search();
    if (e.key === "Escape") {
      setStatus("idle");
      inputRef.current?.blur();
    }
  }

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : "w-52"}`}>
      <div
        className={[
          "flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-sm border rounded-lg px-2.5 py-1.5",
          status === "error" ? "border-red-500/50" : "border-white/10",
        ].join(" ")}
      >
        {/* Postcode icon */}
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
            if (status === "error") setStatus("idle");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white/80 text-xs placeholder-white/30 outline-none min-w-0"
          aria-label="Søk etter postnummer"
        />

        {status === "loading" ? (
          <svg className="animate-spin w-3.5 h-3.5 text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <button
            onClick={search}
            disabled={!isValidPostcode(value)}
            className="flex-shrink-0 text-white/30 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Søk"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="text-red-400/80 text-xs px-1">{errorMsg}</p>
      )}
    </div>
  );
}
