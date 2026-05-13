export type ConnectorType = "CCS" | "CHAdeMO" | "Type2" | "Tesla" | "Other";
export type ChargeSpeed = "slow" | "fast" | "rapid";

export type Connector = {
  id: string;
  type: ConnectorType;
  speedKw: number;
  speed: ChargeSpeed;
  status: "available" | "occupied" | "unknown";
};

export type NobilStation = {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    municipality: string;
    county: string;
  };
  connectors: Connector[];
  network: string;
  openingHours: string | null;
  totalConnectors: number;
};

// Raw Nobil API v3 response shapes — used only in the parser
export type NobilRawAttribute = {
  attrname: string;
  attrval: string | number | null;
  trans?: string;
};

export type NobilRawConnector = {
  connectorId: string;
  connectorTypeId: string;
  connectorTypeName: string;
  numberOfConnectors: number;
  chargingCapacity: number;
  statusId?: string;
};

export type NobilRawStation = {
  csmd: {
    International_id: string;
    name: string;
    Position: string; // "(lat,lng)"
    Street: string;
    House_number: string;
    Zipcode: string;
    City: string;
    Municipality: string;
    County: string;
    Owned_by: string;
    Open_Hours: string | null;
  };
  attr: {
    conn?: NobilRawConnector[];
    [key: string]: unknown;
  };
};
