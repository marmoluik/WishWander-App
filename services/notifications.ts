import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Mail from "@sendgrid/mail";

export enum AlertType {
  FLIGHT_STATUS = "flight_status",
  CHECK_IN_REMINDER = "check_in_reminder",
  WEATHER_ALERT = "weather_alert",
}

interface AlertOptions {
  type: AlertType;
  title: string;
  message: string;
  link?: string;
  token?: string;
  email?: string;
}

const SENDGRID_KEY =
  Constants.expoConfig?.extra?.sendgridApiKey || process.env.SENDGRID_API_KEY;

if (SENDGRID_KEY) {
  Mail.setApiKey(SENDGRID_KEY);
}

export const registerForPushNotifications = async (): Promise<string | undefined> => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return undefined;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

export const sendPushNotification = async (
  token: string,
  opts: AlertOptions
): Promise<void> => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: token,
      title: opts.title,
      body: opts.message,
      data: { url: opts.link, type: opts.type },
    }),
  });
};

export const sendEmailFallback = async (opts: AlertOptions): Promise<void> => {
  if (!SENDGRID_KEY || !opts.email) return;
  await Mail.send({
    to: opts.email,
    from: Constants.expoConfig?.extra?.sendgridFromEmail || "noreply@example.com",
    subject: opts.title,
    html: `${opts.message}${
      opts.link ? `<br/><a href="${opts.link}">View details</a>` : ""
    }`,
  });
};

export const notify = async (opts: AlertOptions): Promise<void> => {
  try {
    if (opts.token) {
      await sendPushNotification(opts.token, opts);
    } else {
      await sendEmailFallback(opts);
    }
  } catch (e) {
    console.error("notify error", e);
    await sendEmailFallback(opts);
  }
};
