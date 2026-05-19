"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";

export default function SavedPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { savedStations, loading: stationsLoading, removeStation } = useSavedPlaces(user);

  // Show sign-in prompt while loading or when not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <svg className="animate-spin w-5 h-5 text-white/30" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark text-white pb-24 sm:pb-0 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Tilbake til kartet
          </Link>
          <span className="text-white font-bold text-sm tracking-tight">
            Strøm<span className="text-brand-blue font-light">Vei</span>
          </span>
        </header>

        {/* Sign-in prompt */}
        <main className="flex-1 flex items-center justify-center px-5">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-6 h-6 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-base mb-2">Logg inn for å se lagrede steder</h2>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              Lagre favorittstasjonene dine og finn dem igjen neste gang.
            </p>
            <button
              onClick={() => void signInWithGoogle()}
              className="flex items-center gap-2 mx-auto px-4 py-2.5 bg-white text-gray-800 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Fortsett med Google
            </button>
          </div>
        </main>
      </div>
    );
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
