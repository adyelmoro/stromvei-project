"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "ios-install-dismissed";

/** Returns true only when running in Mobile Safari on iOS and NOT already installed */
function isIOSSafariNotInstalled(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  if (!isIOS) return false;
  // Already running as installed PWA — don't show the banner
  const isStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (isStandalone) return false;
  // Must be Safari — exclude Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS)
  const isSafari =
    /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isSafari;
}

/**
 * Shows a "tap Share → Add to Home Screen" banner on iOS Safari.
 * Android gets a native install prompt automatically; iOS never does.
 * Dismissed state persisted to localStorage — won't re-appear once closed.
 */
export default function IOSInstallBanner() {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!isIOSSafariNotInstalled()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Delay slightly so it doesn't flash on first paint
    const t = setTimeout(() => {
      setShow(true);
      // Trigger slide-up after mount so CSS transition fires
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setAnimate(false);
    setTimeout(() => setShow(false), 300);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  if (!show) return null;

  return (
    <div
      className="fixed left-4 right-4 flex items-center gap-3 bg-[#0D1527]/97 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 shadow-2xl transition-all duration-300"
      style={{
        zIndex: 60,
        // Sits above BottomNav (~56px) + home indicator (~34px) + 8px gap
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 72px)",
        transform: animate ? "translateY(0)" : "translateY(120%)",
        opacity: animate ? 1 : 0,
      }}
      role="banner"
      aria-label="Installer StrømVei"
    >
      {/* App icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/icon-192.png"
        alt="StrømVei"
        width={40}
        height={40}
        className="rounded-xl flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight">
          Installer StrømVei
        </p>
        <p className="text-white/55 text-xs mt-0.5 leading-snug">
          Trykk{" "}
          <ShareIcon />{" "}
          og velg{" "}
          <span className="text-white/75 font-medium">«Legg til på Hjem-skjerm»</span>
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="flex-shrink-0 text-white/35 hover:text-white/65 transition-colors p-1.5 -mr-1"
        aria-label="Lukk"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/** Inline iOS Share button icon (⬆ box with arrow) */
function ShareIcon() {
  return (
    <svg
      className="inline w-3.5 h-3.5 mx-0.5 -mt-0.5 text-brand-blue"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
