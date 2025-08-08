// app/create-trip/select-dates.tsx

import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarPicker from "react-native-calendar-picker";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { CreateTripContext } from "@/context/CreateTripContext";
import moment from "moment";

const SelectDates: React.FC = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const onDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
    if (type === "END_DATE") {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const days = moment(endDate).diff(moment(startDate), "days") + 1;

    setTripData((prev) => {
      const filtered = prev.filter((item) => !item.dates);
      return [
        ...filtered,
        {
          dates: {
            startDate,
            endDate,
            totalNumberOfDays: days,
          },
        },
      ];
    });

    router.push("/create-trip/select-budget");
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Text className="text-3xl font-outfit-bold text-primary mb-2">
        When are you traveling?
      </Text>
      <Text className="text-lg font-outfit-medium text-secondary mb-6">
        Select your travel dates
      </Text>

      <View className="bg-white rounded-xl border border-primary p-2 mb-6">
        <CalendarPicker
          startFromMonday
          allowRangeSelection
          minDate={new Date()}
          onDateChange={onDateChange}
          selectedDayColor="#9C00FF"
          selectedDayTextColor="#FFFFFF"
          todayBackgroundColor="#B347FF"
          todayTextStyle={{ color: "#FFFFFF" }}
          textStyle={{
            fontFamily: "outfit",
            color: "#1E1B4B",
          }}
          selectedRangeStartStyle={{ backgroundColor: "#9C00FF" }}
          selectedRangeEndStyle={{ backgroundColor: "#9C00FF" }}
          selectedRangeStyle={{ backgroundColor: "#9C00FF" }}
        />
      </View>

      <View className="space-y-4">
        <CustomButton
          title="Confirm Dates"
          onPress={handleConfirm}
          disabled={!startDate || !endDate}
          className="bg-primary text-white"
        />
        <CustomButton
          title="Flexible Dates"
          onPress={() => router.push("/create-trip/flexible-dates")}
          className="border-2 border-primary text-primary bg-background"
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectDates;
