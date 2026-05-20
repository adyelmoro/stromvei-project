const no = {
  // --- Brand ---
  brand: {
    name: "StrømVei",
    tagline: "Din ladeguide for Norge",
    metaDescription:
      "Finn ladestasjoner og planlegg ruten din. Over 10 000 stasjoner i hele Norge.",
    ogTitle: "StrømVei — Ladekart og ruteplaner for Norge",
  },

  // --- Navigation ---
  nav: {
    map: "Kart",
    saved: "Lagrede steder",
    savedShort: "Lagret",
    about: "Om StrømVei",
    aboutShort: "Om",
    routeShort: "Rute",
    languageToggle: "Norsk / English",
    signIn: "Logg inn",
    myAccount: "Min konto",
    signOut: "Logg ut",
  },

  // --- Map Home ---
  map: {
    loading: "Henter ladestasjoner...",
    mapLoading: "Laster kart...",
    stationCount: (n: number) => `Viser ${n} stasjoner`,
    zoomPrompt: "Zoom inn for å se enkeltstasjonene",
    attribution: "Stasjondata: Nobil / Entur",
  },

  // --- Filter Panel ---
  filters: {
    title: "Filtrer stasjoner",
    speedLabel: "Ladehastighet",
    speedSlow: "Lav (under 22 kW)",
    speedFast: "Hurtig (22–50 kW)",
    speedRapid: "Lynlading (over 50 kW)",
    connectorLabel: "Kontakttype",
    networkLabel: "Nettverk",
    clearButton: "Nullstill filter",
    noResults:
      "Ingen stasjoner matcher filteret ditt. Prøv å endre noen valg.",
  },

  // --- Station Detail Drawer ---
  station: {
    connectorsLabel: "Tilgjengelige kontakter",
    speedDisplay: (kw: number) => `Opptil ${kw} kW`,
    operatorLabel: "Operatør",
    hoursLabel: "Åpningstider",
    alwaysOpen: "Alltid åpent",
    availabilityNote: "Tilgjengelighet oppdateres ikke i sanntid",
    saveSignedOut: "Logg inn for å lagre",
    saveUnsaved: "Lagre stasjon",
    saveSaved: "Lagret",
    shareButton: "Del stasjon",
    closeButton: "Lukk",
  },

  // --- Route Planner ---
  routePlanner: {
    title: "Planlegg ruten din",
    originLabel: "Fra",
    originPlaceholder: "Startsted, f.eks. Oslo",
    destinationLabel: "Til",
    destinationPlaceholder: "Destinasjon, f.eks. Bergen",
    rangeLabel: "Rekkevidde (km)",
    rangePlaceholder: "350",
    rangeHelp: "Reell rekkevidde, ikke oppgitt av produsenten",
    minChargeLabel: "Minimum lading ved ankomst (%)",
    minChargePlaceholder: "20",
    submitButton: "Finn ladestopp",
    calculating: "Beregner ruten...",
    noStopsNeeded: (destination: string) =>
      `Ingen ladestopp! Du rekker ${destination} uten å lade.`,
    stopsHeader: (n: number) =>
      n === 1 ? "1 ladestopp på veien" : `${n} ladestopp på veien`,
    stopLabel: (n: number) => `Stopp ${n}`,
    stopDistance: (km: number) => `om ${km} km`,
    stopConnectors: (types: string) => `Tilgjengelig: ${types}`,
    clearRoute: "Fjern rute",
    errorNoStation:
      "Ingen ladestasjon langs ruten er innenfor rekkevidde. Prøv å øke rekkevidden.",
    errorDestUnreachable:
      "Kan ikke nå destinasjonen — ingen stasjon dekker den siste strekningen. Prøv å øke rekkevidden.",
    errorNoRoute:
      "Finner ikke rute mellom disse stedene. Sjekk stednavnene og prøv igjen.",
  },

  // --- Auth Flow ---
  auth: {
    modalTitle: "Logg inn på StrømVei",
    benefitLine: "Lagre favorittstasjonene dine og ruter du vil huske.",
    googleButton: "Fortsett med Google",
    signInSuccess: "Velkommen! Du er nå logget inn.",
    signOutConfirm: "Er du sikker på at du vil logge ut?",
    signOutSuccess: "Du er logget ut.",
  },

  // --- Saved Places ---
  saved: {
    pageTitle: "Lagrede steder",
    tabStations: "Stasjoner",
    tabRoutes: "Ruter",
    emptyStations:
      "Du har ikke lagret noen stasjoner ennå. Trykk på en stasjon på kartet for å lagre den.",
    emptyRoutes:
      "Ingen lagrede ruter. Planlegg en rute og lagre den for å se den her.",
    showOnMap: "Vis på kart",
    savedDate: (date: string) => `Lagret ${date}`,
    removeButton: "Fjern",
    routeLabel: (origin: string, destination: string) =>
      `${origin} til ${destination}`,
    routeStops: (n: number) =>
      n === 1 ? "1 ladestopp" : `${n} ladestopp`,
    showRoute: "Vis rute",
    stationRemoved: "Stasjon fjernet fra lagrede steder.",
    routeRemoved: "Rute fjernet fra lagrede steder.",
  },

  // --- About Page ---
  about: {
    pageTitle: "Om StrømVei",
    description:
      "StrømVei er et åpent ladekart for Norge. Du kan utforske over 10 000 offentlige ladestasjoner, filtrere etter hastighet og kontakttype, og planlegge lange turer med smarte ladestopp langs veien.",
    dataCredit:
      "Stasjonsdata hentes fra Nobil, den nasjonale databasen for ladeinfrastruktur i Norge, driftet av Entur.",
    builtBy:
      "Laget av Ayyad Anwar som del av en portefølje for det norske jobbmarkedet.",
    openSource: "Kildekoden er åpen og tilgjengelig på GitHub.",
    feedback: "Noe som ikke fungerer? Send en e-post til iamayyad@gmail.com",
  },

  // --- System Messages ---
  system: {
    stationsError:
      "Klarte ikke å hente stasjonene. Sjekk tilkoblingen din og prøv igjen.",
    saveSuccess: "Lagret!",
    generalError: "Noe gikk galt. Prøv igjen.",
    notFoundTitle: "Siden finnes ikke",
    notFoundBody: "Denne siden finnes ikke. Gå tilbake til kartet.",
    notFoundButton: "Til kartet",
  },
};

export default no;
export type Translations = typeof no;
