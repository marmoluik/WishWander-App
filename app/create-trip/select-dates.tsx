// app/create-trip/select-dates.tsx

import React, { useContext, useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { CreateTripContext } from "@/context/CreateTripContext";

export default function SelectDates() {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onChangeStart = (_: any, selected?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selected) setStartDate(selected);
  };
  const onChangeEnd = (_: any, selected?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selected) setEndDate(selected);
  };

  const handleConfirm = () => {
    if (endDate < startDate) {
      alert("End date must be after start date");
      return;
    }
    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    const days = moment(endDate).diff(moment(startDate), "days") + 1;

    setTripData((prev) => {
      // filter out any old “dates” entry:
      const filtered = prev.filter((i) => !i.dates);
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>When are you traveling?</Text>

      <View style={styles.pickerRow}>
        <CustomButton
          title={`Start: ${startDate.toLocaleDateString()}`}
          onPress={() => setShowStartPicker(true)}
          style={styles.pickerButton}
        />
        <CustomButton
          title={`End:   ${endDate.toLocaleDateString()}`}
          onPress={() => setShowEndPicker(true)}
          style={styles.pickerButton}
        />
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onChangeStart}
          maximumDate={new Date(2100, 12, 31)}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onChangeEnd}
          minimumDate={startDate}
          maximumDate={new Date(2100, 12, 31)}
        />
      )}

      <View style={styles.confirmRow}>
        <CustomButton
          title="Confirm Dates"
          onPress={handleConfirm}
          disabled={!startDate || !endDate}
          className="bg-primary text-white"
        />
        <CustomButton
          title="Flexible Dates"
          onPress={() => router.push("flexible-dates")}
          className="border-2 border-primary text-primary bg-background"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F5FF",
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 24,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  pickerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  confirmRow: {
    flex: 1,
    justifyContent: "flex-end",
  },
  confirmButton: {
    backgroundColor: "#9C00FF",
    paddingVertical: 14,
    borderRadius: 8,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
