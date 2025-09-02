// src/env.ts
import Constants from "expo-constants";

export const isExpoGo =
  Constants.executionEnvironment === "storeClient"; // Expo Go
export const isDevClient =
  Constants.executionEnvironment === "standalone";  // your own dev/production build
