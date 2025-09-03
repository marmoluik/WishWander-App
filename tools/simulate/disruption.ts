import { replanOnDisruption } from "../../packages/agent/replan";
import { setPolicy, getPolicy, BookingPolicy } from "../../packages/agent/policies";
import { Metrics } from "../../packages/metrics";
import { notify } from "../../packages/notify";
import { Itinerary } from "../../types/itinerary";

/**
 * CLI helper to inject a disruption (cancellation) into a test trip.
 * It generates replan options and sends a notification.
 */
async function main() {
  const tripId = process.argv[2] || "test-trip";
  const userId = process.argv[3] || "test-user";

  console.log(`Injecting disruption for trip ${tripId}`);
  Metrics.disruptionDetected({ tripId });

  const itinerary: Itinerary = {
    id: tripId,
    userId,
    destination: { city: "Test City" },
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    bookings: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const policy: BookingPolicy = {
    perTripCap: 1000,
    perItemCap: 500,
    handsOffMode: true,
  };
  setPolicy(policy);
  const options = await replanOnDisruption(itinerary, getPolicy()!);
  console.log("Generated replan options", options);

  await notify(userId, "disruption", {
    title: "Trip disruption",
    body: `Trip ${tripId} experienced a cancellation` ,
    data: { tripId },
  });
  console.log("Notification queued");
}

main().catch((e) => {
  console.error("simulation failed", e);
  process.exit(1);
});
