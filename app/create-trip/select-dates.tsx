import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CalendarPicker from "react-native-calendar-picker";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { CreateTripContext } from "@/context/CreateTripContext";
import moment from "moment";

const SelectDates = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const onDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
    if (type === "START_DATE") {
      setSelectedStartDate(date);
    } else {
      setSelectedEndDate(date);
    }
  };

  const handleConfirmDates = () => {
    const totalNumberOfDays = moment(selectedEndDate).diff(
      moment(selectedStartDate),
      "days"
    );

    if (selectedStartDate && selectedEndDate) {
      setTripData((prev) => {
        const newData = prev.filter((item) => !item.dates);
        return [
          ...newData,
          {
            dates: {
              startDate: selectedStartDate,
              endDate: selectedEndDate,
              totalNumberOfDays: totalNumberOfDays + 1,
            },
          },
        ];
      });
      router.push("/create-trip/select-budget");
    } else {
      alert("Please select both start and end dates");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-2 py-6">
        <Text className="text-5xl font-outfit-bold mb-2 px-4">
          When are you traveling?
        </Text>
        <Text className="text-text-primary font-outfit-medium mb-6 px-5">
          Select your travel dates
        </Text>

        <View className="bg-background rounded-xl shadow-sm border border-primary p-4">
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={new Date()}
            onDateChange={onDateChange}
            selectedDayColor="#7C3AED"
            selectedDayTextColor="#ffffff"
            todayBackgroundColor="#22C55E"
            todayTextStyle={{ color: "#7C3AED" }}
            textStyle={{
              fontFamily: "outfit",
              color: "#1E1B4B",
            }}
            selectedRangeStartStyle={{
              backgroundColor: "#7C3AED",
            }}
            selectedRangeEndStyle={{
              backgroundColor: "#7C3AED",
            }}
            selectedRangeStyle={{
              backgroundColor: "#7C3AED",
            }}
          />
        </View>

        <View className="mt-6 space-y-2">
          <CustomButton
            title="Confirm Dates"
            onPress={handleConfirmDates}
            disabled={!selectedEndDate}
            className="disabled:opacity-50"
          />
          <CustomButton
            title="Flexible Dates"
            onPress={() => router.push("/create-trip/flexible-dates")}
            bgVariant="outline"
            textVariant="primary"
            // Make the button stand out with a primary border
            className="mt-4 border-2 border-primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectDates;
