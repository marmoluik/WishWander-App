// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  // carry over everything from app.json
  ...config,

  // make sure EAS sees the owner even if app.json is trimmed
  owner: 'veebiagentuur',

  ios: {
    ...config.ios,
    // REQUIRED for iOS builds
    bundleIdentifier: 'com.veebiagentuur.wishwander',
    // keep your background modes (merge with app.json to avoid losing them)
    infoPlist: {
      ...(config.ios?.infoPlist ?? {}),
      UIBackgroundModes: ['fetch', 'processing', 'remote-notification'],
    },
  },

  android: {
    ...config.android,
    // Strongly recommended for Android builds
    package: 'com.veebiagentuur.wishwander',
  },

  extra: {
    ...(config.extra ?? {}),
    // load secrets from .env (DO NOT hardcode here)
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    googleExpoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
    googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    facebookAppId: process.env.FACEBOOK_APP_ID,

    // keep EAS project link here too (safe)
    eas: {
      projectId: 'aa38173b-0884-4dab-b5a4-c022e11ed248',
    },
  },
});
