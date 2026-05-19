"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";

export default function SavedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { savedStations, loading: stationsLoading, removeStation } = useSavedPlaces(user);

  // Redirect to home if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return null; // Redirect in progress
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white pb-24 sm:pb-0">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Tilbake til kartet
        </Link>
        <span className="text-white font-bold text-sm tracking-tight">
          Strøm<span className="text-brand-blue font-light">Vei</span>
        </span>
      </header>

      <main className="max-w-lg mx-auto px-5 py-8">
        <h1 className="text-xl font-semibold text-white mb-1">Lagrede steder</h1>
        <p className="text-white/40 text-sm mb-6">
          {user.email}
        </p>

        {/* Station list */}
        {stationsLoading ? (
          <div className="flex items-center gap-3 text-white/40 text-sm py-8 justify-center">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Laster stasjoner...
          </div>
        ) : savedStations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </div>
            <p className="text-white/40 text-sm">
              Du har ikke lagret noen stasjoner ennå.
            </p>
            <p className="text-white/25 text-xs mt-1">
              Trykk på en stasjon på kartet for å lagre den.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-brand-blue/20 border border-brand-blue/30 text-brand-blue rounded-lg text-sm hover:bg-brand-blue/30 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Gå til kartet
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {savedStations.map((saved) => (
              <li
                key={saved.id}
                className="bg-[#0D1527] border border-white/10 rounded-xl px-4 py-3.5 flex items-center justify-between gap-4"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate">{saved.station_name}</p>
                  <p className="text-white/35 text-xs mt-0.5">
                    {saved.station_lat.toFixed(4)}, {saved.station_lng.toFixed(4)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Show on map */}
                  <Link
                    href={`/?lat=${saved.station_lat}&lng=${saved.station_lng}`}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-colors text-xs"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Vis
                  </Link>

                  {/* Remove */}
                  <button
                    onClick={() => void removeStation(saved.station_id)}
                    className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Fjern fra lagrede steder"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
