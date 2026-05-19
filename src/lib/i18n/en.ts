import type { Translations } from "./no";

const en: Translations = {
  // --- Brand ---
  brand: {
    name: "StrømVei",
    tagline: "Your EV charging guide for Norway",
    metaDescription:
      "Find charging stations and plan your route. Over 10,000 stations across Norway.",
    ogTitle: "StrømVei — Norway's EV charging map and route planner",
  },

  // --- Navigation ---
  nav: {
    map: "Map",
    saved: "Saved places",
    savedShort: "Saved",
    about: "About",
    aboutShort: "About",
    routeShort: "Route",
    languageToggle: "Norsk / English",
    signIn: "Sign in",
    myAccount: "My account",
    signOut: "Sign out",
  },

  // --- Map Home ---
  map: {
    loading: "Loading charging stations...",
    mapLoading: "Loading map...",
    stationCount: (n: number) => `Showing ${n} stations`,
    zoomPrompt: "Zoom in to see individual stations",
    attribution: "Station data: Nobil / Entur",
  },

  // --- Filter Panel ---
  filters: {
    title: "Filter stations",
    speedLabel: "Charging speed",
    speedSlow: "Slow (under 22 kW)",
    speedFast: "Fast (22–50 kW)",
    speedRapid: "Rapid (over 50 kW)",
    connectorLabel: "Connector type",
    networkLabel: "Network",
    clearButton: "Clear filters",
    noResults: "No stations match your filters. Try adjusting your selection.",
  },

  // --- Station Detail Drawer ---
  station: {
    connectorsLabel: "Available connectors",
    speedDisplay: (kw: number) => `Up to ${kw} kW`,
    operatorLabel: "Operator",
    hoursLabel: "Opening hours",
    alwaysOpen: "Open 24/7",
    availabilityNote: "Availability is not updated in real time",
    saveSignedOut: "Sign in to save",
    saveUnsaved: "Save station",
    saveSaved: "Saved",
    shareButton: "Share station",
    closeButton: "Close",
  },

  // --- Route Planner ---
  routePlanner: {
    title: "Plan your route",
    originLabel: "From",
    originPlaceholder: "Start location, e.g. Oslo",
    destinationLabel: "To",
    destinationPlaceholder: "Destination, e.g. Bergen",
    rangeLabel: "Car range (km)",
    rangePlaceholder: "350",
    rangeHelp: "Real-world range, not manufacturer estimate",
    minChargeLabel: "Minimum charge on arrival (%)",
    minChargePlaceholder: "20",
    submitButton: "Find charging stops",
    calculating: "Calculating route...",
    noStopsNeeded: (destination: string) =>
      `No stops needed! You can reach ${destination} without charging.`,
    stopsHeader: (n: number) =>
      n === 1 ? "1 charging stop on the way" : `${n} charging stops on the way`,
    stopLabel: (n: number) => `Stop ${n}`,
    stopDistance: (km: number) => `${km} km ahead`,
    stopConnectors: (types: string) => `Available: ${types}`,
    clearRoute: "Clear route",
    errorNoStation:
      "No charging station found in range. Try increasing your range or lowering your minimum charge.",
    errorNoRoute:
      "Could not find a route between these places. Check the place names and try again.",
  },

  // --- Auth Flow ---
  auth: {
    modalTitle: "Sign in to StrømVei",
    benefitLine: "Save your favourite stations and routes you want to remember.",
    googleButton: "Continue with Google",
    signInSuccess: "Welcome! You're now signed in.",
    signOutConfirm: "Are you sure you want to sign out?",
    signOutSuccess: "You've been signed out.",
  },

  // --- Saved Places ---
  saved: {
    pageTitle: "Saved places",
    tabStations: "Stations",
    tabRoutes: "Routes",
    emptyStations:
      "You haven't saved any stations yet. Tap a station on the map to save it.",
    emptyRoutes: "No saved routes yet. Plan a route and save it to see it here.",
    showOnMap: "Show on map",
    savedDate: (date: string) => `Saved ${date}`,
    removeButton: "Remove",
    routeLabel: (origin: string, destination: string) =>
      `${origin} to ${destination}`,
    routeStops: (n: number) =>
      n === 1 ? "1 charging stop" : `${n} charging stops`,
    showRoute: "Show route",
    stationRemoved: "Station removed from saved places.",
    routeRemoved: "Route removed from saved places.",
  },

  // --- About Page ---
  about: {
    pageTitle: "About StrømVei",
    description:
      "StrømVei is an open charging map for Norway. Explore over 10,000 public charging stations, filter by speed and connector type, and plan long trips with smart charging stops along the way.",
    dataCredit:
      "Station data comes from Nobil, Norway's national database for EV charging infrastructure, operated by Entur.",
    builtBy:
      "Built by Ayyad Anwar as part of a portfolio for the Norwegian job market.",
    openSource: "The source code is open and available on GitHub.",
    feedback: "Something not working? Send an email to iamayyad@gmail.com",
  },

  // --- System Messages ---
  system: {
    stationsError:
      "Could not load stations. Check your connection and try again.",
    saveSuccess: "Saved!",
    generalError: "Something went wrong. Please try again.",
    notFoundTitle: "Page not found",
    notFoundBody: "This page doesn't exist. Head back to the map.",
    notFoundButton: "Back to map",
  },
};

export default en;
