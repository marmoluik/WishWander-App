import React, { useEffect, useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { startChatSession } from "@/config/GeminiConfig";
import CustomButton from "@/components/CustomButton";
import ItineraryDetails from "@/components/ItineraryDetails";
import { ItineraryContext, DayPlan } from "@/context/ItineraryContext";

const ItineraryScreen = () => {
  const router = useRouter();
  const { selectedPlaces, tripData } = useLocalSearchParams();
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const { setItinerary } = useContext(ItineraryContext);

  useEffect(() => {
    generateItinerary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateItinerary = async () => {
    try {
      const places = selectedPlaces ? JSON.parse(selectedPlaces as string) : [];
      const data = tripData ? JSON.parse(tripData as string) : [];
      const dates = data.find((item: any) => item.dates)?.dates;
      const startDate = dates?.startDate ? new Date(dates.startDate) : new Date();
      const totalDays = dates?.totalNumberOfDays || places.length;
      const placeNames = places.map((p: any) => p.name).join(", ");
      const prompt = `Return only JSON. Create a daily itinerary starting on ${startDate.toISOString().split('T')[0]} for ${totalDays} day(s) visiting: ${placeNames}. Use schema {"itinerary":[{"day":1,"date":"","schedule":{"morning":"","afternoon":"","evening":"","night":""},"food_recommendations":"","stay_options":"","optional_activities":[{"name":"","booking_url":""}],"travel_tips":""}]}`;
      const session = startChatSession([{ role: "user", parts: [{ text: prompt }] }]);
      const result = await session.sendMessage(prompt);
      const raw = await result.response.text();
      const json = JSON.parse(raw);
      const planData = json.itinerary || [];
      setPlan(planData);
      setItinerary(planData);
    } catch (e) {
      console.error("itinerary generation failed", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <CustomButton
        title="Back"
        onPress={() => router.back()}
        bgVariant="outline"
        textVariant="primary"
        className="mb-4"
      />
      <ItineraryDetails plan={plan} />
    </SafeAreaView>
  );
};

export default ItineraryScreen;
