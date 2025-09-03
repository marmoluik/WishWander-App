export interface Trip {
  conciergeActive: boolean;
  priority: 'standard' | 'priority';
}

const trips: Record<string, Trip> = {};

export const setTripConcierge = (tripId: string, active: boolean) => {
  const existing = trips[tripId] || { conciergeActive: false, priority: 'standard' };
  existing.conciergeActive = active;
  existing.priority = active ? 'priority' : 'standard';
  trips[tripId] = existing;
};

export const getTrip = (tripId: string): Trip | undefined => trips[tripId];
