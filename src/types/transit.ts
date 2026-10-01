export type CrowdingLevel = 'seats' | 'standing' | 'crowded';
export type DeckType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy
export type PowertrainType = 'EV Electric' | 'Euro 6 Diesel' | 'Euro 5 Diesel' | 'Hybrid';

export interface BusArrivalInfo {
  busId: string;
  plate: string;
  estimatedMinutes: number; // 0 or 1 = "ARRIVING"
  isArriving: boolean;
  deckType: DeckType;
  deckName: string;
  crowding: CrowdingLevel;
  crowdingLabel: string;
  isWheelchairAccessible: boolean;
  powertrain: PowertrainType;
  distanceMetres?: number;
  speedKmh?: number;
}

export interface BusService {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  category: 'TRUNK' | 'FEEDER' | 'EXPRESS' | 'CITY DIRECT';
  origin: string;
  destination: string;
  via: string;
  direction1Name: string;
  direction2Name: string;
  isWAB: boolean;
  simplyGoStandard: boolean;
  firstBusWeekday: string;
  lastBusWeekday: string;
  firstBusSat: string;
  lastBusSat: string;
  firstBusSun: string;
  lastBusSun: string;
  peakHeadway: string;
  offPeakHeadway: string;
  arrivals: BusArrivalInfo[];
  progressionStops: {
    code: string;
    name: string;
    isPast: boolean;
    isCurrent: boolean;
    isNext?: boolean;
    distance?: string;
  }[];
}

export interface BusStop {
  code: string;
  name: string;
  roadName: string;
  distanceMetres: number;
  walkingMinutes: number;
  isSheltered: boolean;
  mrtInterchanges?: string[];
  mrtExit?: string;
  callingServices: string[];
}

export interface ServiceStopArrival {
  serviceNo: string;
  originDest: string;
  deck: string;
  isWAB: boolean;
  firstArrivalMin: number | 'ARR';
  firstCrowding: CrowdingLevel;
  nextArrivalMin: number;
  accentColor?: string;
}

export interface RouteStopDetail {
  seq: number;
  code: string;
  name: string;
  road: string;
  distKm: number;
  fareStage: number;
  mrtConnections: string[];
  hasBusApproaching?: boolean;
  busPlateApproaching?: string;
}

export interface DisruptionNotice {
  id: string;
  lineOrService: string;
  type: 'info' | 'warning' | 'alert';
  title: string;
  description: string;
  affectedStations: string[];
  alternativeTransport: string;
  timestamp: string;
  status: 'Investigating' | 'Active Repair' | 'Normalizing' | 'Scheduled';
}
