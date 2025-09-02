// config/FirebaseConfig.ts

import { Platform } from "react-native";
import Constants from "expo-constants";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  Auth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, Firestore } from "firebase/firestore";

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

// 2️⃣ Initialize Auth differently for web vs native
export const auth: Auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

// 3️⃣ Initialize Firestore
export const db: Firestore = getFirestore(app);
