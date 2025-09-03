export interface FlightSegment {
  /** distance of the segment in kilometers */
  distanceKm: number;
  /** optional aircraft type (e.g. A320, B738) */
  aircraft?: string;
}

// Approximate emission factors (kg CO2 per passenger-km) for some aircraft.
// Defaults to 0.115 kg/km when type is unknown.
const BASE_FACTOR = 0.115;
const AIRCRAFT_FACTORS: Record<string, number> = {
  A320: 0.1,
  A319: 0.105,
  A321: 0.11,
  B738: 0.11,
  B737: 0.11,
  B744: 0.14,
  B788: 0.095,
};

/**
 * Roughly estimate the CO2 emissions for a set of flight segments.
 * Returned value is in kilograms of CO2 equivalent.
 */
export function estimateFlightCO2(segments: FlightSegment[]): number {
  return segments.reduce((total, seg) => {
    const factor =
      (seg.aircraft && AIRCRAFT_FACTORS[seg.aircraft.toUpperCase()]) ||
      BASE_FACTOR;
    return total + seg.distanceKm * factor;
  }, 0);
}
