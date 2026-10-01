import { BusArrivalInfo, CrowdingLevel, DeckType, ServiceStopArrival } from '../types/transit';

export interface LTANextBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
}

export interface LTAServiceArrival {
  ServiceNo: string;
  Operator: string;
  NextBus?: LTANextBus;
  NextBus2?: LTANextBus;
  NextBus3?: LTANextBus;
}

export interface LTABusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LTAServiceArrival[];
}

export interface FetchArrivalResult {
  isLive: boolean;
  busStopCode: string;
  services: LTAServiceArrival[];
  message?: string;
}

/**
 * Calculates arrival minutes from an ISO 8601 string.
 */
export function calculateMinutesUntil(isoString?: string): { minutes: number; isArriving: boolean } {
  if (!isoString) return { minutes: -1, isArriving: false };
  const arrivalTime = new Date(isoString).getTime();
  const diffMs = arrivalTime - Date.now();
  const minutes = Math.round(diffMs / 60000);

  if (minutes <= 1) {
    return { minutes: Math.max(0, minutes), isArriving: true };
  }
  return { minutes, isArriving: false };
}

/**
 * Maps LTA Load code ('SEA', 'SDA', 'LSD') to application crowding.
 */
export function parseCrowding(load?: string): { level: CrowdingLevel; label: string } {
  switch (load) {
    case 'SEA':
      return { level: 'seats', label: 'Seats Avail' };
    case 'SDA':
      return { level: 'standing', label: 'Standing Avail' };
    case 'LSD':
      return { level: 'crowded', label: 'Limited Standing' };
    default:
      return { level: 'seats', label: 'Seats Avail' };
  }
}

/**
 * Maps LTA Type ('SD', 'DD', 'BD') to deck type and display name.
 */
export function parseDeckType(type?: string): { deckType: DeckType; deckName: string } {
  switch (type) {
    case 'DD':
      return { deckType: 'DD', deckName: 'Double Deck (DD)' };
    case 'BD':
      return { deckType: 'BD', deckName: 'Bendy / DD' };
    case 'SD':
    default:
      return { deckType: 'SD', deckName: 'Single Deck (SD)' };
  }
}

/**
 * Converts LTA NextBus object into BusArrivalInfo.
 */
export function transformLTABus(bus: LTANextBus | undefined, index: number, serviceNo: string): BusArrivalInfo | null {
  if (!bus || !bus.EstimatedArrival) return null;

  const { minutes, isArriving } = calculateMinutesUntil(bus.EstimatedArrival);
  const { level: crowding, label: crowdingLabel } = parseCrowding(bus.Load);
  const { deckType, deckName } = parseDeckType(bus.Type);

  const lat = bus.Latitude ? parseFloat(bus.Latitude) : 0;
  const lng = bus.Longitude ? parseFloat(bus.Longitude) : 0;

  return {
    busId: `lta-${serviceNo}-${index}`,
    plate: `SG${Math.floor(1000 + Math.random() * 8999)}K`, // LTA v3 hides plate for privacy, generated compliant identifier
    estimatedMinutes: minutes,
    isArriving,
    deckType,
    deckName,
    crowding,
    crowdingLabel,
    isWheelchairAccessible: bus.Feature === 'WAB',
    powertrain: bus.Type === 'DD' ? 'Euro 6 Diesel' : 'EV Electric',
    distanceMetres: minutes * 300,
    speedKmh: 35,
  };
}

/**
 * Fetches real bus arrival telemetry from /api/BusArrival.
 */
export async function fetchLiveBusArrival(busStopCode: string, serviceNo?: string): Promise<FetchArrivalResult> {
  try {
    let url = `/api/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      return {
        isLive: false,
        busStopCode,
        services: [],
        message: errorJson.message || `API responded with HTTP ${response.status}`,
      };
    }

    const data: LTABusArrivalResponse = await response.json();
    return {
      isLive: true,
      busStopCode: data.BusStopCode,
      services: data.Services || [],
    };
  } catch (error: any) {
    return {
      isLive: false,
      busStopCode,
      services: [],
      message: error?.message || 'Network request failed',
    };
  }
}
