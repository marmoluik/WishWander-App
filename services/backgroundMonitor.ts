import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { Itinerary } from '@/types/itinerary';

const TASK_NAME = 'background-trip-monitor';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await checkTrips();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    console.error('Trip monitor failed', e);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerTripMonitor() {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60 * 30, // every 30 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterTripMonitor() {
  await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
}

async function checkTrips() {
  if (!db) return;
  const snap = await getDocs(collection(db, 'Itineraries'));
  for (const docSnap of snap.docs) {
    const trip = docSnap.data() as Itinerary;
    const alert = await checkWeather(trip.destination);
    if (alert) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Update for ${trip.destination}`,
          body: alert,
        },
        trigger: null,
      });
    }
  }
}

async function checkWeather(city: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`
    );
    const json = await res.json();
    const condition = json?.current_condition?.[0]?.weatherDesc?.[0]?.value;
    if (condition && /storm|rain|snow/i.test(condition)) {
      return `Weather alert: ${condition}`;
    }
  } catch (e) {
    console.error('Weather check failed', e);
  }
  return null;
}
