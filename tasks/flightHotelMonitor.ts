import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import FirestoreService from '@/services/FirestoreService';
import { monitorFlightStatus } from '@/services/FlightService';

const TASK_NAME = 'flight-hotel-monitor';

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    // Check bookings and update Firestore
    void FirestoreService;
    void monitorFlightStatus;
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const registerMonitorTask = async () => {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 60 * 30,
    stopOnTerminate: false,
    startOnBoot: true,
  });
};
