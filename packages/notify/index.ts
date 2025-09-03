export type NotificationType = "disruption" | "replan" | "booking";

interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
}

interface NotificationPreferences {
  disruption: boolean;
  replan: boolean;
  booking: boolean;
}

interface UserProfile {
  email?: string;
  deviceTokens: string[];
  preferences: NotificationPreferences;
}

const defaultPrefs: NotificationPreferences = {
  disruption: true,
  replan: true,
  booking: true,
};

const users: Record<string, UserProfile> = {};

export const setUserEmail = (userId: string, email: string) => {
  const user = users[userId] || { deviceTokens: [], preferences: { ...defaultPrefs } };
  user.email = email;
  users[userId] = user;
};

export const registerDeviceToken = (userId: string, token: string) => {
  const user = users[userId] || { deviceTokens: [], preferences: { ...defaultPrefs } };
  if (!user.deviceTokens.includes(token)) {
    user.deviceTokens.push(token);
  }
  users[userId] = user;
};

export const setNotificationPreferences = (
  userId: string,
  prefs: Partial<NotificationPreferences>
) => {
  const user = users[userId] || { deviceTokens: [], preferences: { ...defaultPrefs } };
  user.preferences = { ...defaultPrefs, ...user.preferences, ...prefs };
  users[userId] = user;
};

export const getNotificationPreferences = (
  userId: string
): NotificationPreferences => {
  return users[userId]?.preferences || { ...defaultPrefs };
};

const emailTemplates: Record<NotificationType, (payload: NotificationPayload) => string> = {
  disruption: (payload) => `
    <h1>Trip Disruption</h1>
    <p>${payload.body}</p>
  `,
  replan: (payload) => `
    <h1>Replan Suggestions</h1>
    <p>${payload.body}</p>
  `,
  booking: (payload) => `
    <h1>Booking Confirmed</h1>
    <p>${payload.body}</p>
  `,
};

export async function notify(
  userId: string,
  type: NotificationType,
  payload: NotificationPayload
) {
  const user = users[userId];
  const prefs = user?.preferences || defaultPrefs;
  if (!prefs[type]) {
    return;
  }

  let pushSent = false;
  if (user?.deviceTokens?.length && process.env.EXPO_ACCESS_TOKEN) {
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          to: user.deviceTokens,
          title: payload.title,
          body: payload.body,
          data: payload.data,
        }),
      });
      pushSent = true;
    } catch (e) {
      console.error("Push notification failed", e);
    }
  }

  if (!pushSent && user?.email && process.env.RESEND_API_KEY) {
    try {
      const html = emailTemplates[type](payload);
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "notifications@wishwander.com",
          to: user.email,
          subject: payload.title,
          html,
        }),
      });
    } catch (e) {
      console.error("Email notification failed", e);
    }
  }
}

