export interface BookingPolicy {
  /** maximum total spend per trip */
  perTripCap: number;
  /** maximum spend per individual item */
  perItemCap: number;
  /** allowed airline brands */
  allowedAirlines?: string[];
  /** allowed hotel brands */
  allowedHotels?: string[];
  /** ISO string representing earliest allowed departure */
  earliestDeparture?: string;
  /** ISO string representing latest allowed departure */
  latestDeparture?: string;
  /** whether hands-off/autonomous bookings are enabled */
  handsOffMode: boolean;
}

export interface PolicyEvaluationRequest {
  /** cost of the item being booked */
  cost: number;
  /** ISO string departure time for flights */
  departureTime?: string;
  /** brand of airline or hotel */
  brand?: string;
  /** cumulative cost of trip so far */
  tripTotal?: number;
}

export interface PolicyDecision {
  allowed: boolean;
  reason?: string;
}

/**
 * Simple in-memory policy store. In a real implementation this would be
 * persisted to a database.
 */
let currentPolicy: BookingPolicy | null = null;

export const getPolicy = (): BookingPolicy | null => currentPolicy;

export const setPolicy = (policy: BookingPolicy) => {
  currentPolicy = policy;
};

/**
 * Evaluate a booking request against the active policy. If the AUTONOMY_ENABLED
 * feature flag or the policy's handsOffMode flag is false, the action is
 * blocked.
 */
export const evaluatePolicy = (
  request: PolicyEvaluationRequest
): PolicyDecision => {
  const autonomyEnabled = process.env.AUTONOMY_ENABLED === "true";
  if (!autonomyEnabled) {
    return { allowed: false, reason: "Autonomy feature disabled" };
  }
  if (!currentPolicy || !currentPolicy.handsOffMode) {
    return { allowed: false, reason: "Hands-Off Mode disabled" };
  }
  if (
    currentPolicy.perItemCap &&
    request.cost > currentPolicy.perItemCap
  ) {
    return { allowed: false, reason: "Item exceeds per-item cap" };
  }
  if (
    typeof request.tripTotal === "number" &&
    currentPolicy.perTripCap &&
    request.tripTotal + request.cost > currentPolicy.perTripCap
  ) {
    return { allowed: false, reason: "Trip exceeds spending cap" };
  }
  if (
    currentPolicy.earliestDeparture &&
    request.departureTime &&
    new Date(request.departureTime) < new Date(currentPolicy.earliestDeparture)
  ) {
    return { allowed: false, reason: "Too early for departure" };
  }
  if (
    currentPolicy.latestDeparture &&
    request.departureTime &&
    new Date(request.departureTime) > new Date(currentPolicy.latestDeparture)
  ) {
    return { allowed: false, reason: "Too late for departure" };
  }
  return { allowed: true };
};
