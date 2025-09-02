import { DefaultFlightStatusProvider } from "../../../packages/providers/flights-status";
import { replanOnDisruption } from "../../../packages/agent/replan";
import { getPolicy } from "../../../packages/agent/policies";
import type { Itinerary } from "../../../types/itinerary";

/**
 * Cron job that polls flight statuses and triggers re-planning on
 * cancellations or long delays.
 */
export const checkFlights = async () => {
  const provider = new DefaultFlightStatusProvider();
  const flights: { id: string; itinerary: Itinerary }[] = [];
  // TODO: load flights from persistence layer
  for (const flight of flights) {
    const status = await provider.getStatus(flight.id);
    if (status.state === "cancelled" || status.state === "delayed") {
      const policy = getPolicy();
      if (!policy) continue;
      await replanOnDisruption(flight.itinerary, policy);
      // TODO: push notification / update UI
    }
  }
};

export default checkFlights;
