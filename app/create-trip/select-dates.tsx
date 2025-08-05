import { View, Text, Switch, TouchableOpacity, FlatList } from "react-native";
import React, { useContext, useState, useEffect } from "react";
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
  const [flexible, setFlexible] = useState(false);
  const [durationRange, setDurationRange] = useState<[number, number]>([5, 7]);
  const [flexibleOptions, setFlexibleOptions] = useState<
    { start: Date; end: Date; price: number }[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const onDateChange = (date: Date, type: "START_DATE" | "END_DATE") => {
    if (type === "START_DATE") {
      setSelectedStartDate(date);
    } else {
      setSelectedEndDate(date);
    }
  };

  const generateFlexibleDates = (range: [number, number]) => {
    const [min, max] = range;
    const today = new Date();
    const opts: { start: Date; end: Date; price: number }[] = [];
    for (let i = 1; i <= 30; i += 3) {
      const start = new Date(today);
      start.setDate(start.getDate() + i);
      const duration = min + Math.floor(Math.random() * (max - min + 1));
      const end = new Date(start);
      end.setDate(end.getDate() + duration);
      const price = 100 + Math.floor(Math.random() * 900);
      opts.push({ start, end, price });
    }
    return opts.sort((a, b) => a.price - b.price).slice(0, 5);
  };

  useEffect(() => {
    if (flexible) {
      setFlexibleOptions(generateFlexibleDates(durationRange));
    }
  }, [flexible, durationRange]);

  const handleConfirmDates = () => {
    if (flexible && selectedOption !== null) {
      const option = flexibleOptions[selectedOption];
      const totalDays =
        moment(option.end).diff(moment(option.start), "days") + 1;
      setTripData((prev) => {
        const newData = prev.filter((item) => !item.dates);
        return [
          ...newData,
          {
            dates: {
              startDate: option.start,
              endDate: option.end,
              totalNumberOfDays: totalDays,
            },
          },
        ];
      });
      router.push("/create-trip/select-budget");
    } else if (selectedStartDate && selectedEndDate) {
      const totalNumberOfDays = moment(selectedEndDate).diff(
        moment(selectedStartDate),
        "days"
      );
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
      alert("Please select dates");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-2 py-6">
        <Text className="text-5xl font-outfit-bold mb-2 px-4">
          When are you traveling?
        </Text>
        <Text className="text-gray-500 font-outfit-medium mb-6 px-5">
          Select your travel dates
        </Text>

        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text className="text-lg font-outfit">Flexible Dates</Text>
          <Switch
            value={flexible}
            onValueChange={(v) => {
              setFlexible(v);
              setSelectedOption(null);
            }}
          />
        </View>

        {flexible ? (
          <View>
            <Text className="text-gray-500 font-outfit-medium mb-2 px-5">
              Trip Duration
            </Text>
            <View className="flex-row flex-wrap px-4 mb-4">
              {[
                [5, 7],
                [7, 10],
                [10, 14],
              ].map((range, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setDurationRange(range as [number, number]);
                    setSelectedOption(null);
                  }}
                  className={`px-3 py-2 m-1 rounded-full border ${
                    durationRange[0] === range[0] &&
                    durationRange[1] === range[1]
                      ? "bg-purple-200 border-purple-500"
                      : "border-gray-300"
                  }`}
                >
                  <Text className="font-outfit">
                    {range[0]}-{range[1]} days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <FlatList
              data={flexibleOptions}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setSelectedOption(index)}
                  className={`p-3 m-1 rounded-xl border ${
                    selectedOption === index
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300"
                  }`}
                >
                  <Text className="font-outfit-bold">
                    {moment(item.start).format("MMM D")} - {" "}
                    {moment(item.end).format("MMM D")}
                  </Text>
                  <Text className="font-outfit text-gray-600">
                    ${item.price}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={new Date()}
              onDateChange={onDateChange}
              selectedDayColor="#8b5cf6"
              selectedDayTextColor="#ffffff"
              todayBackgroundColor="#f2e6ff"
              todayTextStyle={{ color: "#8b5cf6" }}
              textStyle={{
                fontFamily: "outfit",
                color: "#000000",
              }}
              selectedRangeStartStyle={{
                backgroundColor: "#7f6eac",
              }}
              selectedRangeEndStyle={{
                backgroundColor: "#7f6eac",
              }}
              selectedRangeStyle={{
                backgroundColor: "#8b5cf6",
              }}
            />
          </View>
        )}

        <View className="mt-6">
          <CustomButton
            title="Confirm Dates"
            onPress={handleConfirmDates}
            disabled={flexible ? selectedOption === null : !selectedEndDate}
            className="disabled:opacity-50"
          />
          <CustomButton
            title="Search Flexible Dates"
            bgVariant="outline"
            textVariant="primary"
            onPress={() => router.push('/create-trip/flexible-dates')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectDates;

