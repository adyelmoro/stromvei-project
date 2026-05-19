"use client";

/**
 * RoutePlannerContext
 *
 * Bridges state between page.tsx (which owns route planner logic) and
 * BottomNav (which lives in layout.tsx and needs to toggle the panel).
 *
 * Keeps the context surface minimal — only what BottomNav needs to render
 * the Rute tab correctly, plus a toggle function page.tsx wires up.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type RoutePlannerContextValue = {
  isOpen: boolean;
  hasActiveRoute: boolean;
  toggle: () => void;
  /** Called by page.tsx to register its toggle handler */
  registerToggle: (fn: () => void) => void;
  /** Called by page.tsx to sync active-route state into context */
  setHasActiveRoute: (v: boolean) => void;
};

const RoutePlannerContext = createContext<RoutePlannerContextValue>({
  isOpen: false,
  hasActiveRoute: false,
  toggle: () => {},
  registerToggle: () => {},
  setHasActiveRoute: () => {},
});

export function RoutePlannerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasActiveRoute, setHasActiveRoute] = useState(false);
  // Mutable ref to avoid stale-closure in toggle
  const [externalToggle, setExternalToggle] = useState<(() => void) | null>(null);

  const toggle = useCallback(() => {
    if (externalToggle) {
      externalToggle();
    } else {
      setIsOpen((v) => !v);
    }
  }, [externalToggle]);

  const registerToggle = useCallback((fn: () => void) => {
    setExternalToggle(() => fn);
  }, []);

  return (
    <RoutePlannerContext.Provider
      value={{ isOpen, hasActiveRoute, toggle, registerToggle, setHasActiveRoute }}
    >
      {children}
    </RoutePlannerContext.Provider>
  );
}

export function useRoutePlanner() {
  return useContext(RoutePlannerContext);
}
