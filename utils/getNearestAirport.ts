import airports from '@/utils/airports.json';

export interface Airport {
  code: string;
  name: string;
  lat: number;
  lng: number;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

export function getNearestAirport(lat: number, lng: number): Airport | null {
  let nearest: Airport | null = null;
  let minDist = Infinity;

  for (const airport of airports as Airport[]) {
    const dLat = toRad(airport.lat - lat);
    const dLng = toRad(airport.lng - lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(airport.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Earth radius in km

    if (distance < minDist) {
      minDist = distance;
      nearest = airport;
    }
  }

  return nearest;
}
