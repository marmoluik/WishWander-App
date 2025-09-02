import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import CustomButton from "@/components/CustomButton";
import WeatherSuggestionChip from "@/components/WeatherSuggestionChip";
import { DayPlan } from "@/context/ItineraryContext";
import { logWeatherAdjustment } from "@/utils/weatherLog";
import { generateHotelLink } from "@/utils/travelpayouts";
import { recordAffiliateClick } from "@/services/affiliate";

interface Props {
  plan: DayPlan[];
}

const slotIcon: Record<string, any> = {
  morning: "sunny",
  afternoon: "partly-sunny",
  evening: "cloudy-night",
  night: "moon",
};

const activityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("boat") || lower.includes("sail")) return "boat";
  if (lower.includes("hike")) return "walk";
  if (lower.includes("tour")) return "map";
  return "pricetag";
};

const linkifyText = (text: string) => {
  const match = text.match(/\b(?:at|in|on|along)\s+([A-Z][^.,]+)/);
  if (match) {
    const loc = match[1].trim();
    const before = text.slice(0, match.index! + match[0].indexOf(loc));
    const after = text.slice(match.index! + match[0].length);
    return (
      <Text className="text-text-primary">
        {before}
        <Text
          className="text-accent underline"
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`
            )
          }
        >
          {loc}
        </Text>
        {after}
      </Text>
    );
  }
  return <Text className="text-text-primary">{text}</Text>;
};

// Build affiliate links via Travelpayouts
const generateStayLink = (name: string) => generateHotelLink(name);

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
          <View key={index} className="mb-4 border border-primary rounded-xl">
            <TouchableOpacity
              onPress={() =>
                setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }))
              }
              className="p-4 bg-secondary/20 rounded-t-xl flex-row justify-between"
            >
              <Text className="font-outfit-bold text-text-primary">
                Day {d.day} - {moment(d.date).format("MMM D, YYYY")}
              </Text>
              <Text className="text-text-primary">{collapsed[index] ? "+" : "-"}</Text>
            </TouchableOpacity>
              {!collapsed[index] && (
                <View className="p-4 space-y-3">
                  {d.weatherSuggestion && (
                    <WeatherSuggestionChip
                      message={d.weatherSuggestion}
                      onApply={() => logWeatherAdjustment(d.weatherSuggestion!)}
                    />
                  )}
                  {(["morning", "afternoon", "evening", "night"] as const).map(
                    (slot) => {
                      const activity = (d.schedule as any)[slot];
                      if (!activity) return null;
                      return (
                        <View key={slot} className="mb-2 flex-row">
                          <Ionicons
                            name={slotIcon[slot] as any}
                            size={20}
                            color="#9C00FF"
                            style={{ marginRight: 8, marginTop: 2 }}
                          />
                          <View className="flex-1">
                            <Text className="font-outfit-medium capitalize flex-row items-center">
                              {slot}
                              <Ionicons
                                name={activity.indoor ? "home" : "leaf"}
                                size={16}
                                color={activity.indoor ? "#9C00FF" : "#16a34a"}
                                style={{ marginLeft: 4 }}
                              />
                            </Text>
                            {linkifyText(activity.name)}
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
                      color="#9C00FF"
                      style={{ marginRight: 8, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="font-outfit-medium">
                        Food Recommendations
                      </Text>
                      {linkifyText(d.food_recommendations)}
                    </View>
                  </View>
                ) : null}
                {d.stay_options ? (
                  <View className="flex-row">
                    <Ionicons
                      name="bed"
                      size={20}
                      color="#9C00FF"
                      style={{ marginRight: 8, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="font-outfit-medium">Stay Options</Text>
                      {linkifyText(d.stay_options)}
                      <TouchableOpacity
                        className="mt-2 bg-primary px-3 py-1 rounded-full w-24 items-center"
                        onPress={() => {
                          recordAffiliateClick("hotel");
                          Linking.openURL(generateStayLink(d.stay_options));
                        }}
                      >
                        <Text className="font-outfit-bold text-white">Book</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                {d.optional_activities?.length ? (
                  <View>
                    <View className="flex-row mb-1">
                      <Ionicons
                        name="bicycle"
                        size={20}
                        color="#9C00FF"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text className="font-outfit-medium">
                        Optional Activities
                      </Text>
                    </View>
                    {d.optional_activities.map((act, i) => (
                      <View
                        key={i}
                        className="mb-2 ml-6 flex-row items-center"
                      >
                        <Ionicons
                          name={activityIcon(act.name) as any}
                          size={20}
                          color="#9C00FF"
                          style={{ marginRight: 6 }}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            Linking.openURL(
                              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                act.name
                              )}`
                            )
                          }
                          className="flex-1"
                        >
                          <Text className="text-text-primary">{act.name}</Text>
                        </TouchableOpacity>
                        {act.booking_url?.startsWith("http") && (
                          <TouchableOpacity
                            onPress={() => {
                              recordAffiliateClick("poi");
                              Linking.openURL(act.booking_url);
                            }}
                            className="ml-2 bg-primary px-3 py-1 rounded-full"
                          >
                            <Text className="font-outfit-bold text-white text-sm">
                              Book
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                ) : null}
                {d.travel_tips ? (
                  <View className="flex-row">
                    <Ionicons
                      name="bulb"
                      size={20}
                      color="#9C00FF"
                      style={{ marginRight: 8, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="font-outfit-medium">Travel Tips</Text>
                      {linkifyText(d.travel_tips)}
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
            bgVariant="outline"
            textVariant="primary"
          />
        </View>
      )}
    </>
  );
};

export default ItineraryDetails;
