// config/FirebaseConfig.ts

import { Platform } from "react-native";
import Constants from "expo-constants";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pull your values from app.config.js → extra (or .env → EXPO_PUBLIC_…)
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
} = Constants.expoConfig!.extra!;

// 1️⃣ Initialize Firebase App
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// 2️⃣ Initialize Auth with correct persistence for React Native
export const auth: Auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

// 3️⃣ Initialize Firestore
export const db: Firestore = getFirestore(app);
