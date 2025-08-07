import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import { collection, getDocs } from "firebase/firestore";
import { fetchFlightInfo } from "@/utils/travelpayouts";
import { db } from "@/config/FirebaseConfig";

const TASK_NAME = "trip-monitor";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    if (!db) return BackgroundFetch.BackgroundFetchResult.NoData;
    const tripsSnap = await getDocs(collection(db, "UserTrips"));
    for (const userDoc of tripsSnap.docs) {
      const tripsCol = collection(db, "UserTrips", userDoc.id, "trips");
      const trips = await getDocs(tripsCol);
      for (const t of trips.docs) {
        const trip = t.data() as any;
        const flight = trip?.tripPlan?.trip_plan?.flight_details;
        if (flight?.departure_city && flight?.arrival_city && flight?.departure_date) {
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
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    console.error("trip monitor failed", e);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerTripMonitor = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 60, // 1 hour
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (e) {
    console.error("registerTripMonitor error", e);
  }
};
