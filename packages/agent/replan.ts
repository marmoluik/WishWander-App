import { Itinerary } from "../../types/itinerary";
import { BookingPolicy, evaluatePolicy } from "./policies";

export interface ReplanOption {
  itinerary: Itinerary;
  eta: number; // minutes until arrival
  costDelta: number; // additional cost compared to original booking
  co2?: number; // estimated CO2 in kg
  autoApply?: boolean; // whether the option meets policy and can be auto-applied
}

/**
 * Given a disrupted itinerary and the active policy, generate alternative
 * options sorted by ETA, cost delta, then CO2 emissions.
 */
export const replanOnDisruption = async (
  itinerary: Itinerary,
  policy: BookingPolicy
): Promise<ReplanOption[]> => {
  // In a real implementation, search external APIs for alternatives.
  const mockOptions: ReplanOption[] = [
    {
      itinerary,
      eta: 120,
      costDelta: 50,
      co2: 20,
    },
    {
      itinerary,
      eta: 90,
      costDelta: 100,
      co2: 25,
    },
    {
      itinerary,
      eta: 150,
      costDelta: 30,
      co2: 18,
    },
  ];

  const evaluated = mockOptions.map((opt) => ({
    ...opt,
    autoApply: evaluatePolicy({
      cost: opt.costDelta,
      tripTotal: opt.costDelta,
    }).allowed,
  }));

  return evaluated.sort((a, b) => {
    if (a.eta !== b.eta) return a.eta - b.eta;
    if (a.costDelta !== b.costDelta) return a.costDelta - b.costDelta;
    return (a.co2 || 0) - (b.co2 || 0);
  });
};
