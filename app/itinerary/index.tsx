import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { startChatSession } from "@/config/GeminiConfig";
import CustomButton from "@/components/CustomButton";

interface DayPlan {
  day: number;
  date: string;
  schedule: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  food_recommendations: string;
  stay_options: string;
  optional_activities: { name: string; booking_url: string }[];
  travel_tips: string;
}

const ItineraryScreen = () => {
  const { selectedPlaces, tripData } = useLocalSearchParams();
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

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
      setPlan(json.itinerary || []);
    } catch (e) {
      console.error("itinerary generation failed", e);
    }
  };

  const collapseAll = () => {
    const newState: Record<number, boolean> = {};
    plan.forEach((_, idx) => {
      newState[idx] = true;
    });
    setCollapsed(newState);
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <ScrollView>
        {plan.map((d, index) => (
          <View key={index} className="mb-4 border border-gray-200 rounded-xl">
            <TouchableOpacity
              onPress={() =>
                setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }))
              }
              className="p-4 bg-purple-100 rounded-t-xl flex-row justify-between"
            >
              <Text className="font-outfit-bold">
                Day {d.day} - {moment(d.date).format("MMM D, YYYY")}
              </Text>
              <Text>{collapsed[index] ? "+" : "-"}</Text>
            </TouchableOpacity>
            {!collapsed[index] && (
              <View className="p-4 space-y-3">
                {(["morning", "afternoon", "evening", "night"] as const).map(
                  (slot) => (
                    <View key={slot} className="mb-2">
                      <Text className="font-outfit-medium capitalize">
                        {slot}
                      </Text>
                      <Text className="text-gray-700">
                        {(d.schedule as any)[slot]}
                      </Text>
                    </View>
                  )
                )}
                {d.food_recommendations ? (
                  <View>
                    <Text className="font-outfit-medium">
                      Food Recommendations
                    </Text>
                    <Text className="text-gray-700">
                      {d.food_recommendations}
                    </Text>
                  </View>
                ) : null}
                {d.stay_options ? (
                  <View>
                    <Text className="font-outfit-medium">Stay Options</Text>
                    <Text className="text-gray-700">{d.stay_options}</Text>
                  </View>
                ) : null}
                {d.optional_activities?.length ? (
                  <View>
                    <Text className="font-outfit-medium">
                      Optional Activities
                    </Text>
                    {d.optional_activities.map((act, i) => (
                      <Text key={i} className="text-gray-700">
                        • {act.name}
                      </Text>
                    ))}
                  </View>
                ) : null}
                {d.travel_tips ? (
                  <View>
                    <Text className="font-outfit-medium">Travel Tips</Text>
                    <Text className="text-gray-700">{d.travel_tips}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View className="mt-2">
        <CustomButton
          title="Collapse All Days"
          onPress={collapseAll}
          bgVariant="secondary"
        />
      </View>
    </SafeAreaView>
  );
};

export default ItineraryScreen;
