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
      <Text className="text-gray-700">
        {before}
        <Text
          className="text-purple-600 underline"
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
  return <Text className="text-gray-700">{text}</Text>;
};

const generateBookingUrl = (name: string) => {
  const affiliateId = process.env.EXPO_PUBLIC_BOOKING_AFFILIATE_ID;
  const encodedName = encodeURIComponent(name);
  return `https://www.booking.com/searchresults.html?ss=${encodedName}${
    affiliateId ? `&aid=${affiliateId}` : ""
  }`;
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
                          {linkifyText(text)}
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
                      {linkifyText(d.food_recommendations)}
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
                      {linkifyText(d.stay_options)}
                      <TouchableOpacity
                        className="mt-2 bg-purple-600 px-3 py-1 rounded-full w-24 items-center"
                        onPress={() =>
                          Linking.openURL(generateBookingUrl(d.stay_options))
                        }
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
                        color="#8b5cf6"
                        style={{ marginRight: 8, marginTop: 2 }}
                      />
                      <Text className="font-outfit-medium">
                        Optional Activities
                      </Text>
                    </View>
                    {d.optional_activities.map((act, i) => {
                      const buildUrl = (name: string, url?: string) => {
                        const search = (provider: "getyourguide" | "viator") =>
                          provider === "getyourguide"
                            ? `https://www.getyourguide.com/s/?q=${encodeURIComponent(name)}`
                            : `https://www.viator.com/search/?q=${encodeURIComponent(name)}`;
                        if (!url) return search("getyourguide");
                        try {
                          const parsed = new URL(url);
                          if (parsed.hostname.includes("getyourguide")) {
                            if (
                              parsed.pathname === "/" ||
                              parsed.pathname.split("/").filter(Boolean).length < 2
                            ) {
                              return search("getyourguide");
                            }
                            return url;
                          }
                          if (parsed.hostname.includes("viator")) {
                            if (
                              parsed.pathname === "/" ||
                              parsed.pathname.split("/").filter(Boolean).length < 2
                            ) {
                              return search("viator");
                            }
                            return url;
                          }
                        } catch {
                          // fall through to default
                        }
                        return search("getyourguide");
                      };
                      const bookingUrl = buildUrl(act.name, act.booking_url);
                      return (
                        <View
                          key={i}
                          className="mb-2 ml-6 flex-row items-center"
                        >
                          <Ionicons
                            name={activityIcon(act.name) as any}
                            size={20}
                            color="#8b5cf6"
                            style={{ marginRight: 6 }}
                          />
                          <View className="flex-1">{linkifyText(act.name)}</View>
                          <TouchableOpacity
                            onPress={() => Linking.openURL(bookingUrl)}
                            className="ml-2 bg-purple-600 px-3 py-1 rounded-full"
                          >
                            <Text className="font-outfit-bold text-white text-sm">
                              Book
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
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
            bgVariant="secondary"
          />
        </View>
      )}
    </>
  );
};

export default ItineraryDetails;
