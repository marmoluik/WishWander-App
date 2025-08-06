import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import CustomButton from "@/components/CustomButton";
import { DayPlan } from "@/context/ItineraryContext";

interface Props {
  plan: DayPlan[];
}

const slotIcon: Record<string, any> = {
  morning: "sunny",
  afternoon: "partly-sunny",
  evening: "cloudy-night",
  night: "moon",
};

const ItineraryDetails: React.FC<Props> = ({ plan }) => {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const collapseAll = () => {
    const newState: Record<number, boolean> = {};
    plan.forEach((_, idx) => {
      newState[idx] = true;
    });
    setCollapsed(newState);
  };

  return (
    <>
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
                  (slot) => {
                    const text = (d.schedule as any)[slot];
                    if (!text) return null;
                    return (
                      <View key={slot} className="mb-2 flex-row">
                        <Ionicons
                          name={slotIcon[slot] as any}
                          size={20}
                          color="#8b5cf6"
                          style={{ marginRight: 8, marginTop: 2 }}
                        />
                        <View className="flex-1">
                          <Text className="font-outfit-medium capitalize">
                            {slot}
                          </Text>
                          <Text className="text-gray-700">{text}</Text>
                        </View>
                      </View>
                    );
                  }
                )}
                {d.food_recommendations ? (
                  <View className="flex-row">
                    <Ionicons
                      name="restaurant"
                      size={20}
                      color="#8b5cf6"
                      style={{ marginRight: 8, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="font-outfit-medium">
                        Food Recommendations
                      </Text>
                      <Text className="text-gray-700">
                        {d.food_recommendations}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {d.stay_options ? (
                  <View className="flex-row">
                    <Ionicons
                      name="bed"
                      size={20}
                      color="#8b5cf6"
                      style={{ marginRight: 8, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="font-outfit-medium">Stay Options</Text>
                      <Text className="text-gray-700">{d.stay_options}</Text>
                    </View>
                  </View>
                ) : null}
                {d.optional_activities?.length ? (
                  <View>
                    <View className="flex-row mb-1">
                      <Ionicons
                        name="bicycle"
                        size={20}
                        color="#8b5cf6"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text className="font-outfit-medium">
                        Optional Activities
                      </Text>
                    </View>
                    {d.optional_activities.map((act, i) => (
                      <View key={i} className="mb-1 ml-6">
                        <Text className="text-gray-700">• {act.name}</Text>
                        {act.booking_url ? (
                          <CustomButton
                            title="Book"
                            onPress={() => Linking.openURL(act.booking_url)}
                            bgVariant="outline"
                            textVariant="primary"
                            className="mt-1 w-32"
                          />
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : null}
                {d.travel_tips ? (
                  <View className="flex-row">
                    <Ionicons
                      name="bulb"
                      size={20}
                      color="#8b5cf6"
                      style={{ marginRight: 8, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="font-outfit-medium">Travel Tips</Text>
                      <Text className="text-gray-700">{d.travel_tips}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      {plan.length > 0 && (
        <View className="mt-2">
          <CustomButton
            title="Collapse All Days"
            onPress={collapseAll}
            bgVariant="secondary"
          />
        </View>
      )}
    </>
  );
};

export default ItineraryDetails;
