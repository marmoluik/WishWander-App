import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { startChatSession } from "@/config/GeminiConfig";
import ItineraryDetails from "@/components/ItineraryDetails";
import {
  ItineraryContext,
  StoredItinerary,
  DayPlan,
} from "@/context/ItineraryContext";
import { suggestWeatherSwaps } from "@/packages/agent/weatherScheduler";
import { applyProfileToPlan } from "@/packages/agent/profileScoring";

const Itineraries = () => {
  const { itineraries, addItinerary, removeItinerary } = useContext(ItineraryContext);
  const { selectedPlaces, tripData } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlaces) {
      generateItinerary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaces]);

  // No animation effect needed for custom loader

  const generateItinerary = async () => {
    try {
      setLoading(true);
      const places = selectedPlaces ? JSON.parse(selectedPlaces as string) : [];
      const data = tripData ? JSON.parse(tripData as string) : [];
      const dates = data.find((item: any) => item.dates)?.dates;
      const location = data.find((item: any) => item.locationInfo)?.locationInfo;
      const startDate = dates?.startDate ? new Date(dates.startDate) : new Date();
      const totalDays = dates?.totalNumberOfDays || places.length;
      const placeNames = places.map((p: any) => p.name).join(", ");
      const prompt = `Return only JSON. Include optional_activities with booking_url using GetYourGuide or Viator links. Create a daily itinerary starting on ${startDate.toISOString().split('T')[0]} for ${totalDays} day(s) visiting: ${placeNames}. Use schema {"itinerary":[{"day":1,"date":"","schedule":{"morning":"","afternoon":"","evening":"","night":""},"food_recommendations":"","stay_options":"","optional_activities":[{"name":"","booking_url":""}],"travel_tips":""}]}`;
      const session = startChatSession([{ role: "user", parts: [{ text: prompt }] }]);
      const result = await session.sendMessage(prompt);
      const raw = await result.response.text();
        const json = JSON.parse(raw);
        const rawPlan: any[] = json.itinerary || [];
        let planData: DayPlan[] = rawPlan.map((d) => ({
          ...d,
          schedule: {
            morning: d.schedule?.morning
              ? { name: d.schedule.morning, indoor: true }
              : undefined,
            afternoon: d.schedule?.afternoon
              ? { name: d.schedule.afternoon, indoor: true }
              : undefined,
            evening: d.schedule?.evening
              ? { name: d.schedule.evening, indoor: true }
              : undefined,
            night: d.schedule?.night
              ? { name: d.schedule.night, indoor: true }
              : undefined,
          },
        }));

        // analyse weather and annotate plan with swap suggestions
        try {
          const swaps = await suggestWeatherSwaps(
            planData,
            location?.coordinates?.lat || 0,
            location?.coordinates?.lng || 0
          );
          if (swaps.length) {
            const s = swaps[0];
            const activity = planData[s.fromDay - 1].schedule[s.fromSlot];
            if (activity) {
              planData[s.fromDay - 1].weatherSuggestion = `${s.reason} — move ${activity.name} to day ${s.toDay}?`;
            }
          }
        } catch (err) {
          console.error("weather swap analysis failed", err);
        }

        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const profile = await res.json();
            planData = applyProfileToPlan(planData, profile);
          }
        } catch (err) {
          console.error("profile adjustment failed", err);
        }
      const id = Date.now().toString();
      const title = location?.name || "Trip";
      const tripId = `${title}-${dates?.startDate || id}`;
      const stored: StoredItinerary = { id, tripId, title, plan: planData };
      addItinerary(stored);
      setCurrentId(id);
    } catch (e) {
      console.error("itinerary generation failed", e);
    }
    setLoading(false);
  };

  const selectedItinerary = itineraries.find((i) => i.id === currentId);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Itinerary", "Are you sure you want to remove this itinerary?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeItinerary(id) },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Image
          source={require("@/assets/images/wishwander_loading.gif")}
          className="w-96 h-96"
        />
        <Text className="font-outfit-medium mt-2 text-text-primary">
          Generating itinerary...
        </Text>
      </SafeAreaView>
    );
  }

  if (selectedItinerary) {
    return (
      <SafeAreaView className="flex-1 p-4">
        <TouchableOpacity className="mb-4" onPress={() => setCurrentId(null)}>
          <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
        </TouchableOpacity>
        <ItineraryDetails plan={selectedItinerary.plan} />
      </SafeAreaView>
    );
  }

  const grouped = itineraries.reduce(
    (acc: Record<string, StoredItinerary[]>, it) => {
      const key = it.tripId || "";
      acc[key] = acc[key] || [];
      acc[key].push(it);
      return acc;
    },
    {}
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      {itineraries.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="font-outfit text-text-primary">No itinerary saved.</Text>
        </View>
      ) : (
        Object.values(grouped).map((group, idx) => (
          <View key={idx} className="mb-6">
            <Text className="font-outfit-bold text-lg mb-2">
              {group[0]?.title}
            </Text>
            {group.map((it) => (
              <View
                key={it.id}
                className="flex-row items-center p-4 mb-3 bg-background rounded-xl border border-primary"
              >
                <TouchableOpacity
                  className="flex-row items-center flex-1"
                  onPress={() => setCurrentId(it.id)}
                >
                  <Ionicons
                    name="map"
                    size={24}
                    color="#9C00FF"
                    style={{ marginRight: 12 }}
                  />
                  <Text className="font-outfit-bold flex-1">{it.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9C00FF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(it.id)}
                  className="ml-4"
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))
      )}
    </SafeAreaView>
  );
};

export default Itineraries;

