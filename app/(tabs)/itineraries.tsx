import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
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
  const { itineraries, addItinerary, removeItinerary } = useContext(ItineraryContext);
  const { selectedPlaces, tripData } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedPlaces) {
      generateItinerary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlaces]);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loading, spinValue]);

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

  const handleDelete = (id: string) => {
    Alert.alert("Delete Itinerary", "Are you sure you want to remove this itinerary?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeItinerary(id) },
    ]);
  };

  if (loading) {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="document-text" size={64} color="#FF4698" />
        </Animated.View>
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
          <View
            key={it.id}
            className="flex-row items-center p-4 mb-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <TouchableOpacity
              className="flex-row items-center flex-1"
              onPress={() => setCurrentId(it.id)}
            >
              <Ionicons
                name="map"
                size={24}
                color="#FF4698"
                style={{ marginRight: 12 }}
              />
              <Text className="font-outfit-bold flex-1">{it.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#FF4698" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(it.id)} className="ml-4">
              <Ionicons name="trash" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </SafeAreaView>
  );
};

export default Itineraries;

