// src/background/registerTripMonitor.ts
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { isExpoGo } from "../env";

// Define the task (safe to define always)
export const TRIP_MONITOR_TASK = "TRIP_MONITOR_TASK";
TaskManager.defineTask(TRIP_MONITOR_TASK, async () => {
  // your background work here
  return BackgroundFetch.Result.NewData;
});

// Call this during startup (e.g., in _layout or App)
export async function ensureTripMonitorRegistered() {
  if (isExpoGo) {
    console.warn("Background tasks are disabled in Expo Go.");
    return;
  }

  try {
    // Only in dev client / production builds
    await BackgroundFetch.registerTaskAsync(TRIP_MONITOR_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (e) {
    console.error("registerTripMonitor error", e);
  }
}
