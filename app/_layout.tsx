import * as tslib from "tslib";
import "setimmediate";
import "@/config/sentry";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "react-native-get-random-values";
import { CreateTripContext } from "@/context/CreateTripContext";
import {
  ItineraryContext,
  StoredItinerary,
} from "@/context/ItineraryContext";
import { UserPreferencesContext } from "@/context/UserPreferencesContext";
import { UserPreferences } from "@/types/user";
import HeaderLogo from "@/components/HeaderLogo";
import { SubscriptionContext } from "@/context/SubscriptionContext";
import {
  SubscriptionState,
  defaultSubscriptionState,
} from "@/types/subscription";

(globalThis as any).tslib = tslib;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [tripData, setTripData] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<StoredItinerary[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredAirlines: [],
    preferredHotels: [],
    dietaryNeeds: [],
    budget: undefined,
    petFriendly: false,
  });
  const [subscription, setSubscription] = useState<SubscriptionState>(
    defaultSubscriptionState
  );

  const addItinerary = (it: StoredItinerary) => {
    setItineraries((prev) => [...prev, it]);
  };

  const removeItinerary = (id: string) => {
    setItineraries((prev) => prev.filter((it) => it.id !== id));
  };

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("itineraries");
        if (stored) {
          setItineraries(JSON.parse(stored));
        }
      } catch (e) {
        console.error("load itineraries failed", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("userPreferences");
        if (stored) {
          setPreferences(JSON.parse(stored));
        }
      } catch (e) {
        console.error("load preferences failed", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("subscriptionState");
        if (stored) {
          setSubscription(JSON.parse(stored));
        } else {
          const { fetchSubscriptionState } = await import(
            "@/services/subscription"
          );
          const remote = await fetchSubscriptionState();
          setSubscription(remote);
        }
      } catch (e) {
        console.error("load subscription failed", e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("itineraries", JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    AsyncStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    AsyncStorage.setItem("subscriptionState", JSON.stringify(subscription));
  }, [subscription]);

  const [loaded] = useFonts({
    outfit: require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      import("@/services/tripMonitor").then(({ registerTripMonitor }) =>
        registerTripMonitor()
      );
      import("@/services/payment").then(({ initializeStripe }) =>
        initializeStripe()
      );
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <SubscriptionContext.Provider value={{ subscription, setSubscription }}>
        <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
          <CreateTripContext.Provider value={{ tripData, setTripData }}>
            <ItineraryContext.Provider
              value={{ itineraries, addItinerary, removeItinerary }}
            >
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="create-trip" />
                <Stack.Screen
                  name="generate-trip"
                  options={{ headerShown: true, headerTitle: () => <HeaderLogo /> }}
                />
              </Stack>
            </ItineraryContext.Provider>
          </CreateTripContext.Provider>
        </UserPreferencesContext.Provider>
      </SubscriptionContext.Provider>
    </>
  );
}

export default RootLayout;
