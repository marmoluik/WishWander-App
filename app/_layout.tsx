import 'setimmediate';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "react-native-get-random-values";
import Constants from "expo-constants"; // ⬅️ NEW
import { CreateTripContext } from "@/context/CreateTripContext";
import { ItineraryContext, StoredItinerary } from "@/context/ItineraryContext";
import HeaderLogo from "@/components/HeaderLogo";
import { registerTripMonitor } from "@/services/tripMonitor";
import { initNotifications } from "@/src/notifications";
import { auth } from "@/config/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ChatProvider } from "@/context/ChatContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [tripData, setTripData] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<StoredItinerary[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("itineraries");
        if (stored) {
          const parsed: StoredItinerary[] = JSON.parse(stored).map((it: any) => ({
            tripId: it.tripId || it.title || "trip",
            ...it,
          }));
          setItineraries(parsed);
        }
      } catch (e) {
        console.error("failed to load itineraries", e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("itineraries", JSON.stringify(itineraries)).catch((e) =>
      console.error("failed to save itineraries", e)
    );
  }, [itineraries]);

  const addItinerary = (it: StoredItinerary) => {
    setItineraries((prev) => [...prev, it]);
  };

  const removeItinerary = (id: string) => {
    setItineraries((prev) => prev.filter((it) => it.id !== id));
  };

  const updateTripData = (newData: any) => {
    setTripData((prevData) => {
      const dataKey = Object.keys(newData)[0];
      const filteredData = prevData.filter((item) => !item[dataKey]);
      return [...filteredData, newData];
    });
  };

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    outfit: require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      const isExpoGo = Constants.executionEnvironment === "storeClient"; // ⬅️ NEW
      if (isExpoGo) {
        console.warn("Background tasks are disabled in Expo Go. Skipping registerTripMonitor().");
      } else {
        registerTripMonitor(); // only runs in dev client / standalone
      }

      const uid = auth?.currentUser?.uid;
      if (uid) {
        initNotifications(uid);
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <NavigationThemeProvider
      value={scheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <CurrencyProvider>
        <ChatProvider>
          <CreateTripContext.Provider value={{ tripData, setTripData }}>
            <ItineraryContext.Provider
              value={{ itineraries, addItinerary, removeItinerary }}
            >
              <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="create-trip" />
              <Stack.Screen
                name="generate-trip"
                options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
              />
              <Stack.Screen
                name="mytrip"
                options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
              />
              <Stack.Screen
                name="discover"
                options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
              />
              <Stack.Screen
                name="itineraries"
                options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
              />
              <Stack.Screen
                name="chat"
                options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
              />
              <Stack.Screen
                name="profile"
                options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
              />
              </Stack>
            </ItineraryContext.Provider>
          </CreateTripContext.Provider>
        </ChatProvider>
      </CurrencyProvider>
    </NavigationThemeProvider>
  );
}
