// src/notifications/index.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { isExpoGo } from "../env";

export async function initNotifications() {
  // Local notifications are okay in Expo Go; remote push setup is not.
  const available = typeof (Notifications as any).isAvailableAsync === "function"
    ? await (Notifications as any).isAvailableAsync()
    : true;
  if (!available || isExpoGo) {
    console.warn(
      "Notifications not fully supported in this runtime (Expo Go). Skipping push setup."
    );
    return;
  }

  // Request permissions (dev client / standalone builds)
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permissions not granted.");
    return;
  }

  // Get push token only when supported (dev client / standalone)
  try {
    const projectId = (Notifications as any).getExpoPushTokenAsync
      ? undefined // SDK 49–53 handles internally; leave undefined for EAS projects
      : undefined;

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    console.log("Expo push token:", tokenResponse.data);
  } catch (e) {
    console.warn("Failed to get push token:", e);
  }

  // Optional handlers/listeners…
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}
