import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import moment from "moment";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";

interface DayPlan {
  date: Date;
  schedule: {
    Morning: string;
    Afternoon: string;
    Evening: string;
    Night: string;
  };
  food: string;
  stay: string;
  optional: string[];
  tips: string;
  collapsed: boolean;
}

const Itinerary = () => {
  const { tripData, selectedPlaces } = useContext(CreateTripContext);
  const startDateData = tripData.find((i: any) => i.dates)?.dates?.startDate;
  const totalDaysData = tripData.find((i: any) => i.dates)?.dates
    ?.totalNumberOfDays;
  const startDate = startDateData ? new Date(startDateData) : new Date();
  const totalDays = totalDaysData || Math.max(selectedPlaces.length, 1);
  const [days, setDays] = useState<DayPlan[]>([]);
  const [allCollapsed, setAllCollapsed] = useState(false);

  useEffect(() => {
    const plans: DayPlan[] = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      plans.push({
        date,
        schedule: {
          Morning: selectedPlaces[i]?.name || "",
          Afternoon: selectedPlaces[i + 1]?.name || "",
          Evening: "",
          Night: "",
        },
        food: "",
        stay: "",
        optional: [],
        tips: "",
        collapsed: false,
      });
    }
    setDays(plans);
  }, []);

  const updateSchedule = (
    index: number,
    slot: keyof DayPlan["schedule"],
    text: string
  ) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index].schedule[slot] = text;
      return updated;
    });
  };

  const updateDay = (
    index: number,
    field: keyof Omit<DayPlan, "date" | "schedule" | "collapsed" | "optional">,
    text: string
  ) => {
    setDays((prev) => {
      const updated = [...prev];
      // @ts-ignore
      updated[index][field] = text;
      return updated;
    });
  };

  const addOptional = (index: number) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index].optional.push("");
      return updated;
    });
  };

  const updateOptional = (dayIndex: number, optIndex: number, text: string) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[dayIndex].optional[optIndex] = text;
      return updated;
    });
  };

  const addDay = () => {
    const lastDate = days.length
      ? days[days.length - 1].date
      : startDate;
    const date = new Date(lastDate);
    date.setDate(lastDate.getDate() + 1);
    setDays([
      ...days,
      {
        date,
        schedule: { Morning: "", Afternoon: "", Evening: "", Night: "" },
        food: "",
        stay: "",
        optional: [],
        tips: "",
        collapsed: false,
      },
    ]);
  };

  const moveDay = (index: number, dir: number) => {
    const target = index + dir;
    if (target < 0 || target >= days.length) return;
    const newDays = [...days];
    [newDays[index], newDays[target]] = [newDays[target], newDays[index]];
    setDays(newDays);
  };

  const toggleCollapse = (index: number) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[index].collapsed = !updated[index].collapsed;
      return updated;
    });
  };

  const collapseAll = () => {
    setAllCollapsed(true);
    setDays((prev) => prev.map((d) => ({ ...d, collapsed: true })));
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-outfit-bold">Itinerary</Text>
        <CustomButton title="Collapse All" onPress={collapseAll} />
      </View>
      {days.map((day, index) => (
        <View key={index} className="mb-6 border border-gray-200 rounded-xl p-4">
          <View className="flex-row justify-between items-center">
            <Text className="font-outfit-bold text-lg">
              Day {index + 1} - {moment(day.date).format("MMM D, YYYY")}
            </Text>
            <View className="flex-row">
              <TouchableOpacity onPress={() => moveDay(index, -1)} className="mr-2">
                <Ionicons name="arrow-up" size={20} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveDay(index, 1)} className="mr-2">
                <Ionicons name="arrow-down" size={20} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleCollapse(index)}>
                <Ionicons
                  name={day.collapsed ? "chevron-down" : "chevron-up"}
                  size={20}
                  color="#8b5cf6"
                />
              </TouchableOpacity>
            </View>
          </View>

          {!day.collapsed && (
            <View>
              <Text className="font-outfit-bold mt-4">Daily Schedule</Text>
              {(["Morning", "Afternoon", "Evening", "Night"] as const).map(
                (slot) => (
                  <View key={slot} className="mt-2">
                    <Text className="font-outfit">{slot}</Text>
                    <TextInput
                      value={day.schedule[slot]}
                      onChangeText={(t) => updateSchedule(index, slot, t)}
                      className="border border-gray-200 rounded-md p-2 mt-1"
                    />
                  </View>
                )
              )}

              <Text className="font-outfit-bold mt-4">Food Recommendations</Text>
              <TextInput
                value={day.food}
                onChangeText={(t) => updateDay(index, "food", t)}
                className="border border-gray-200 rounded-md p-2 mt-1"
              />

              <Text className="font-outfit-bold mt-4">Stay Options</Text>
              <TextInput
                value={day.stay}
                onChangeText={(t) => updateDay(index, "stay", t)}
                className="border border-gray-200 rounded-md p-2 mt-1"
              />

              <Text className="font-outfit-bold mt-4">Optional Activities</Text>
              {day.optional.map((opt, i) => (
                <View key={i} className="flex-row items-center mt-2">
                  <TextInput
                    value={opt}
                    onChangeText={(t) => updateOptional(index, i, t)}
                    className="border border-gray-200 rounded-md p-2 flex-1 mr-2"
                  />
                  <CustomButton title="Quick Bookings" onPress={() => {}} />
                </View>
              ))}
              <CustomButton
                title="Add Activity"
                onPress={() => addOptional(index)}
                className="mt-2"
              />

              <Text className="font-outfit-bold mt-4">Travel Tips</Text>
              <TextInput
                value={day.tips}
                onChangeText={(t) => updateDay(index, "tips", t)}
                className="border border-gray-200 rounded-md p-2 mt-1"
              />
            </View>
          )}
        </View>
      ))}

      <CustomButton title="Add a Day" onPress={addDay} />
    </ScrollView>
  );
};

export default Itinerary;

