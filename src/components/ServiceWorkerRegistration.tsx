"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js on mount. Renders nothing — purely a side-effect component.
 * Placed in the root layout so it runs on every page.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // Check for updates every time the user navigates (app loads)
        reg.update().catch(() => {});
      })
      .catch((err) => {
        // Non-fatal — app works fine without the SW
        console.warn("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
