import { logWeatherAdjustment } from "../../utils/weatherLog";
import { Metrics } from "../../packages/metrics";

/**
 * CLI helper to force a "rain at 16:00" scenario for tests.
 */
async function main() {
  const tripId = process.argv[2] || "test-trip";
  console.log(`Forcing rain at 16:00 for ${tripId}`);
  logWeatherAdjustment(`forced-rain-16:${tripId}`);
  Metrics.disruptionDetected({ tripId, weather: "rain@16" });
}

main().catch((e) => {
  console.error("weather simulation failed", e);
  process.exit(1);
});
