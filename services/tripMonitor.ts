import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import { collection, getDocs } from "firebase/firestore";
import { fetchFlightInfo } from "@/utils/travelpayouts";
import { db } from "@/config/FirebaseConfig";

const TASK_NAME = "trip-monitor";

const tripMonitorTask = async () => {
  try {
    if (!db) return BackgroundTask.BackgroundTaskResult.Success;
    const tripsSnap = await getDocs(collection(db, "UserTrips"));
    for (const userDoc of tripsSnap.docs) {
      const tripsCol = collection(db, "UserTrips", userDoc.id, "trips");
      const trips = await getDocs(tripsCol);
      for (const t of trips.docs) {
        const trip = t.data() as any;
        const flight = trip?.tripPlan?.trip_plan?.flight_details;
        if (
          flight?.departure_city &&
          flight?.arrival_city &&
          flight?.departure_date
        ) {
          const info = await fetchFlightInfo(
            flight.departure_city,
            flight.arrival_city,
            flight.departure_date
          );
          if (info && info.price && info.price !== flight.price) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Flight price changed",
                body: `${flight.departure_city} → ${flight.arrival_city} now $${info.price}`,
              },
              trigger: null,
            });
          }
        }
      }
    }
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.error("trip monitor failed", e);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
};

export const registerTripMonitor = async () => {
  try {
    // ensure the task is defined before attempting to register
    try {
      TaskManager.defineTask(TASK_NAME, tripMonitorTask);
    } catch {
      // ignore if task is already defined
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60, // minutes
      });
    }
  } catch (e) {
    console.error("registerTripMonitor error", e);
  }
};
