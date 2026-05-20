import type { NobilStation } from "@/types/nobil";

// Representative mock stations across Norway for development (Nobil key pending)
export const MOCK_STATIONS: NobilStation[] = [
  {
    id: "NOR_00001",
    name: "Recharge Oslo Sentrum",
    position: { lat: 59.9139, lng: 10.7522 },
    address: { street: "Karl Johans gate 1", city: "Oslo", postalCode: "0154", municipality: "Oslo", county: "Oslo" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CHAdeMO", speedKw: 50, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: null, totalConnectors: 2,
  },
  {
    id: "NOR_00002",
    name: "IONITY Bergen Vest",
    position: { lat: 60.3913, lng: 5.3221 },
    address: { street: "Fjøsangerveien 50", city: "Bergen", postalCode: "5054", municipality: "Bergen", county: "Vestland" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 350, speed: "rapid", status: "occupied" },
    ],
    network: "IONITY", openingHours: null, totalConnectors: 2,
  },
  {
    id: "NOR_00003",
    name: "Recharge Trondheim Sentralstasjon",
    position: { lat: 63.4305, lng: 10.3951 },
    address: { street: "Nedre Elvehavn 4", city: "Trondheim", postalCode: "7042", municipality: "Trondheim", county: "Trøndelag" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
      { id: "3", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: "06:00–23:00", totalConnectors: 3,
  },
  {
    id: "NOR_00004",
    name: "Tesla Supercharger Stavanger",
    position: { lat: 58.9700, lng: 5.7331 },
    address: { street: "Forus Næringspark 2", city: "Stavanger", postalCode: "4033", municipality: "Stavanger", county: "Rogaland" },
    connectors: [
      { id: "1", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "2", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "3", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "4", type: "Tesla", speedKw: 250, speed: "rapid", status: "occupied" },
    ],
    network: "Tesla", openingHours: null, totalConnectors: 4,
  },
  {
    id: "NOR_00005",
    name: "Circle K Tromsø",
    position: { lat: 69.6492, lng: 18.9553 },
    address: { street: "Stakkevollveien 10", city: "Tromsø", postalCode: "9010", municipality: "Tromsø", county: "Troms" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 50, speed: "fast", status: "available" },
      { id: "2", type: "CHAdeMO", speedKw: 50, speed: "fast", status: "unknown" },
    ],
    network: "Circle K", openingHours: "00:00–24:00", totalConnectors: 2,
  },
  {
    id: "NOR_00006",
    name: "Recharge Kristiansand Sør",
    position: { lat: 58.1599, lng: 8.0182 },
    address: { street: "Vestre Strandgate 26", city: "Kristiansand", postalCode: "4611", municipality: "Kristiansand", county: "Agder" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "Type2", speedKw: 11, speed: "slow", status: "available" },
    ],
    network: "Recharge", openingHours: null, totalConnectors: 2,
  },
  {
    id: "NOR_00007",
    name: "IONITY E6 Lillehammer Nord",
    position: { lat: 61.1153, lng: 10.4662 },
    address: { street: "E6 Rasteplass Nord", city: "Lillehammer", postalCode: "2609", municipality: "Lillehammer", county: "Innlandet" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
      { id: "3", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
    ],
    network: "IONITY", openingHours: null, totalConnectors: 3,
  },
  {
    id: "NOR_00008",
    name: "Recharge Ålesund Sentrum",
    position: { lat: 62.4723, lng: 6.1549 },
    address: { street: "Keiser Wilhelms gate 11", city: "Ålesund", postalCode: "6003", municipality: "Ålesund", county: "Møre og Romsdal" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 50, speed: "fast", status: "available" },
      { id: "2", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: "07:00–22:00", totalConnectors: 2,
  },
  {
    id: "NOR_00009",
    name: "Circle K Bodø Sentrum",
    position: { lat: 67.2804, lng: 14.4049 },
    address: { street: "Sjøgata 23", city: "Bodø", postalCode: "8006", municipality: "Bodø", county: "Nordland" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CHAdeMO", speedKw: 50, speed: "fast", status: "available" },
    ],
    network: "Circle K", openingHours: null, totalConnectors: 2,
  },
  {
    id: "NOR_00010",
    name: "Recharge Drammen Stasjon",
    position: { lat: 59.7440, lng: 10.2045 },
    address: { street: "Strømsø Torg 1", city: "Drammen", postalCode: "3040", municipality: "Drammen", county: "Viken" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 150, speed: "rapid", status: "occupied" },
      { id: "3", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: null, totalConnectors: 3,
  },
  {
    id: "NOR_00011",
    name: "Fortum Skien Sentrum",
    position: { lat: 59.2089, lng: 9.6043 },
    address: { street: "Langbrygga 1", city: "Skien", postalCode: "3724", municipality: "Skien", county: "Telemark" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 50, speed: "fast", status: "available" },
      { id: "2", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Fortum", openingHours: "06:00–23:00", totalConnectors: 2,
  },
  {
    id: "NOR_00012",
    name: "Tesla Supercharger Gardermoen",
    position: { lat: 60.1939, lng: 11.0998 },
    address: { street: "Oslo Lufthavn, P-hus", city: "Gardermoen", postalCode: "2061", municipality: "Ullensaker", county: "Viken" },
    connectors: [
      { id: "1", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "2", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "3", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "4", type: "Tesla", speedKw: 250, speed: "rapid", status: "available" },
      { id: "5", type: "Tesla", speedKw: 250, speed: "rapid", status: "occupied" },
      { id: "6", type: "Tesla", speedKw: 250, speed: "rapid", status: "occupied" },
    ],
    network: "Tesla", openingHours: null, totalConnectors: 6,
  },

  // ── Oslo–Bergen corridor (E16 / Rv7) ─────────────────────────────────────
  // These stations enable the route planner algorithm to show real results on
  // the demo route. Coordinates are on or within 5 km of the OSRM route.
  {
    id: "NOR_00013",
    name: "Circle K Hønefoss",
    position: { lat: 60.1676, lng: 10.2530 },
    address: { street: "Storgata 12", city: "Hønefoss", postalCode: "3510", municipality: "Ringerike", county: "Viken" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "3", type: "CHAdeMO", speedKw: 50, speed: "fast", status: "available" },
    ],
    network: "Circle K", openingHours: null, totalConnectors: 3,
  },
  {
    id: "NOR_00014",
    name: "Recharge Nesbyen",
    position: { lat: 60.5680, lng: 9.0970 },
    address: { street: "Rv7 Nesbyen", city: "Nesbyen", postalCode: "3540", municipality: "Nesbyen", county: "Viken" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "3", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: null, totalConnectors: 3,
  },
  {
    id: "NOR_00015",
    name: "IONITY Gol",
    position: { lat: 60.7025, lng: 8.9483 },
    address: { street: "Rv7 Gol", city: "Gol", postalCode: "3550", municipality: "Gol", county: "Viken" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
      { id: "3", type: "CCS", speedKw: 350, speed: "rapid", status: "available" },
      { id: "4", type: "CCS", speedKw: 350, speed: "rapid", status: "occupied" },
    ],
    network: "IONITY", openingHours: null, totalConnectors: 4,
  },
  {
    id: "NOR_00016",
    name: "Recharge Geilo",
    position: { lat: 60.5311, lng: 8.1982 },
    address: { street: "Rv7 Geilo", city: "Geilo", postalCode: "3580", municipality: "Hol", county: "Viken" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "3", type: "CHAdeMO", speedKw: 50, speed: "fast", status: "available" },
      { id: "4", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: null, totalConnectors: 4,
  },
  {
    id: "NOR_00017",
    name: "Fortum Eidfjord",
    position: { lat: 60.4641, lng: 7.0729 },
    address: { street: "Rv7 Eidfjord", city: "Eidfjord", postalCode: "5783", municipality: "Eidfjord", county: "Vestland" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
    ],
    network: "Fortum", openingHours: null, totalConnectors: 2,
  },
  {
    id: "NOR_00018",
    name: "Recharge Voss",
    position: { lat: 60.6277, lng: 6.4200 },
    address: { street: "Vossavangen 20", city: "Voss", postalCode: "5700", municipality: "Voss", county: "Vestland" },
    connectors: [
      { id: "1", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "2", type: "CCS", speedKw: 150, speed: "rapid", status: "available" },
      { id: "3", type: "CHAdeMO", speedKw: 50, speed: "fast", status: "available" },
      { id: "4", type: "Type2", speedKw: 22, speed: "fast", status: "available" },
    ],
    network: "Recharge", openingHours: null, totalConnectors: 4,
  },
];
