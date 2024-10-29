// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHSP1w0OlgSssMgsUsTMpjdmza9nCPnqY",
  authDomain: "saurabhprojects-eac6b.firebaseapp.com",
  projectId: "saurabhprojects-eac6b",
  storageBucket: "saurabhprojects-eac6b.appspot.com",
  messagingSenderId: "590177454659",
  appId: "1:590177454659:web:9068f5dbd5b83d9cbbe2f6",
  measurementId: "G-DQ6YXMT2F8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

