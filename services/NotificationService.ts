import * as Notifications from 'expo-notifications';

export const registerForPushNotificationsAsync = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

export const sendNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
};

export default { registerForPushNotificationsAsync, sendNotification };
