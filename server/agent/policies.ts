export interface HandsOffPolicy {
  tripBudget: number;
  bookingLimit: number;
  preferredAirlines: string[];
  bannedAirlines: string[];
}

export const defaultPolicy: HandsOffPolicy = {
  tripBudget: 0,
  bookingLimit: 0,
  preferredAirlines: [],
  bannedAirlines: [],
};
