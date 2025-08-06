import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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

const Itineraries = () => {
  const { itineraries, addItinerary } = useContext(ItineraryContext);
  const { selectedPlaces, tripData } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlaces) {
      generateItinerary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaces]);

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
      const planData: DayPlan[] = json.itinerary || [];
      const id = Date.now().toString();
      const title = location?.name || "Trip";
      const stored: StoredItinerary = { id, title, plan: planData };
      addItinerary(stored);
      setCurrentId(id);
    } catch (e) {
      console.error("itinerary generation failed", e);
    }
    setLoading(false);
  };

  const selectedItinerary = itineraries.find((i) => i.id === currentId);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="font-outfit-medium mt-2">Generating itinerary...</Text>
      </SafeAreaView>
    );
  }

  if (selectedItinerary) {
    return (
      <SafeAreaView className="flex-1 p-4">
        <TouchableOpacity
          className="mb-4"
          onPress={() => setCurrentId(null)}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ItineraryDetails plan={selectedItinerary.plan} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      {itineraries.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="font-outfit text-gray-600">No itinerary saved.</Text>
        </View>
      ) : (
        itineraries.map((it) => (
          <TouchableOpacity
            key={it.id}
            className="p-4 mb-3 bg-gray-50 rounded-xl border border-gray-100"
            onPress={() => setCurrentId(it.id)}
          >
            <Text className="font-outfit-bold">{it.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </SafeAreaView>
  );
};

export default Itineraries;

