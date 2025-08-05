import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
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

  const addDay = () => {
    const nextDay = plan.length + 1;
    const date = plan.length
      ? moment(plan[plan.length - 1].date).add(1, "day").format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
    setPlan((prev) => [
      ...prev,
      {
        day: nextDay,
        date,
        schedule: { morning: "", afternoon: "", evening: "", night: "" },
        food_recommendations: "",
        stay_options: "",
        optional_activities: [],
        travel_tips: "",
      },
    ]);
  };

  const collapseAll = () => {
    const newState: Record<number, boolean> = {};
    plan.forEach((_, idx) => {
      newState[idx] = true;
    });
    setCollapsed(newState);
  };

  const moveDay = (index: number, direction: -1 | 1) => {
    const newPlan = [...plan];
    const target = index + direction;
    if (target < 0 || target >= newPlan.length) return;
    const temp = newPlan[index];
    newPlan[index] = newPlan[target];
    newPlan[target] = temp;
    newPlan.forEach((d, i) => (d.day = i + 1));
    setPlan(newPlan);
  };

  const updateField = (dayIndex: number, key: keyof DayPlan, value: any) => {
    setPlan((prev) =>
      prev.map((d, i) => (i === dayIndex ? { ...d, [key]: value } : d))
    );
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
                Day {d.day} - {d.date}
              </Text>
              <Text>{collapsed[index] ? "+" : "-"}</Text>
            </TouchableOpacity>
            {!collapsed[index] && (
              <View className="p-4 space-y-2">
                {(["morning", "afternoon", "evening", "night"] as const).map(
                  (slot) => (
                    <TextInput
                      key={slot}
                      value={(d.schedule as any)[slot]}
                      onChangeText={(t) =>
                        updateField(index, "schedule", {
                          ...d.schedule,
                          [slot]: t,
                        })
                      }
                      placeholder={slot}
                      className="border p-2 rounded"
                    />
                  )
                )}
                <TextInput
                  value={d.food_recommendations}
                  onChangeText={(t) => updateField(index, "food_recommendations", t)}
                  placeholder="Food Recommendations"
                  className="border p-2 rounded"
                />
                <TextInput
                  value={d.stay_options}
                  onChangeText={(t) => updateField(index, "stay_options", t)}
                  placeholder="Stay Options"
                  className="border p-2 rounded"
                />
                <TextInput
                  value={d.travel_tips}
                  onChangeText={(t) => updateField(index, "travel_tips", t)}
                  placeholder="Travel Tips"
                  className="border p-2 rounded"
                />
                <View className="flex-row justify-between mt-2">
                  <TouchableOpacity onPress={() => moveDay(index, -1)}>
                    <Text className="text-purple-600">Move Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => moveDay(index, 1)}>
                    <Text className="text-purple-600">Move Down</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View className="mt-2">
        <CustomButton title="Add Day" onPress={addDay} className="mb-2" />
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
