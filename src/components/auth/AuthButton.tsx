"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <button
        onClick={() => void signInWithGoogle()}
        className="flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1.5 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
      >
        {/* Google G */}
        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="hidden sm:inline text-xs">Logg inn</span>
      </button>
    );
  }

  // ── Signed in ─────────────────────────────────────────────────────────────
  const initial = (user.email ?? "?")[0].toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-brand-dark/80 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1.5 hover:border-white/20 transition-colors"
        aria-label="Brukermeny"
      >
        <span className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white text-[11px] font-bold select-none">
          {initial}
        </span>
        <svg
          className={`w-3 h-3 text-white/40 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {menuOpen && (
        <>
          {/* Click-outside trap */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 35 }}
            onClick={() => setMenuOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-1.5 bg-[#0D1527] border border-white/10 rounded-xl shadow-2xl py-1 min-w-44 overflow-hidden"
            style={{ zIndex: 40 }}
          >
            {/* Email */}
            <div className="px-3 py-2 border-b border-white/10">
              <p className="text-white/35 text-xs truncate">{user.email}</p>
            </div>

            {/* Saved places */}
            <Link
              href="/saved"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              Lagrede steder
            </Link>

            {/* Sign out */}
            <button
              onClick={() => { void signOut(); setMenuOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors w-full"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logg ut
            </button>
          </div>
        </>
      )}
    </div>
  );
}
