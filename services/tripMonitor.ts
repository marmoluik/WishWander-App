import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { collection, getDocs } from "firebase/firestore";
import { fetchFlightInfo } from "@/utils/travelpayouts";
import { db } from "@/config/FirebaseConfig";
import { notify, AlertType } from "@/services/notifications";

const TASK_NAME = "trip-monitor";

// Define the background task
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    if (!db) return BackgroundTask.BackgroundTaskResult.NoData;

    const tripsSnap = await getDocs(collection(db, "UserTrips"));
    for (const userDoc of tripsSnap.docs) {
      const tripsCol = collection(db, "UserTrips", userDoc.id, "trips");
      const trips = await getDocs(tripsCol);
      const user = userDoc.data() as any;
      const token = user?.pushToken;
      const email = user?.email;
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
            await notify({
              type: AlertType.FLIGHT_STATUS,
              title: "Flight price changed",
              message: `${flight.departure_city} → ${
                flight.arrival_city
              } now $${info.price}`,
              link: `/trips/${t.id}`,
              token,
              email,
            });
          }
        }
      }
    }

    return BackgroundTask.BackgroundTaskResult.NewData;
  } catch (e) {
    console.error("trip monitor failed", e);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Register the background task
export const registerTripMonitor = async () => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(TASK_NAME, {
        minimumInterval: 60 * 60, // 1 hour
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Trip monitor background task registered");
    }
  } catch (e) {
    console.error("registerTripMonitor error", e);
  }
};
