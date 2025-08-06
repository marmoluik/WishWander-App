import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateTripContext } from "@/context/CreateTripContext";
import CustomButton from "@/components/CustomButton";
import moment from "moment";
import { useRouter } from "expo-router";

interface FlexibleResult {
  start: string;
  end: string;
  price: string;
}

const durationOptions = [
  { label: "5-7 days", from: 5, to: 7 },
  { label: "7-10 days", from: 7, to: 10 },
  { label: "10-14 days", from: 10, to: 14 },
];

const FlexibleDates = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState(durationOptions[0]);
  const [results, setResults] = useState<FlexibleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [minDays, setMinDays] = useState("");
  const [maxDays, setMaxDays] = useState("");

  const locationInfo = tripData.find((item) => item.locationInfo)?.locationInfo;
  const originAirport = tripData.find((item) => item.originAirport)?.originAirport;

  const searchFlexible = async () => {
    if (!originAirport || !locationInfo?.name) {
      Alert.alert("Select an origin and destination first");
      return;
    }
    const tpToken = process.env.EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN;
    if (!tpToken) {
      Alert.alert("Missing Travelpayouts token");
      return;
    }

    setLoading(true);
    try {
      const locRes = await fetch(
        `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(
          locationInfo.name
        )}&locale=en&types[]=airport&limit=1`
      );
      const locJson = await locRes.json();
      const arrival = locJson?.[0];
      if (!arrival?.code) {
        setLoading(false);
        return;
      }

      let nightsFrom = selectedDuration.from;
      let nightsTo = selectedDuration.to;

      if (minDays && maxDays) {
        const fromNum = parseInt(minDays, 10);
        const toNum = parseInt(maxDays, 10);
        if (isNaN(fromNum) || isNaN(toNum)) {
          Alert.alert("Please enter valid numbers for day range");
          setLoading(false);
          return;
        }
        nightsFrom = fromNum;
        nightsTo = toNum;
      }

      const searchUrl = `https://api.travelpayouts.com/v2/prices/month-matrix?origin=${originAirport.code}&destination=${arrival.code}&token=${tpToken}&currency=usd`;
      const flightRes = await fetch(searchUrl);
      const flightJson = await flightRes.json();
      const flights = Array.isArray(flightJson.data)
        ? flightJson.data
        : Object.values(flightJson.data || {});
      const parsed: FlexibleResult[] = (flights as any[])
        .map((f: any) => ({
          start: f.depart_date,
          end: f.return_date,
          price: `${f.value} ${flightJson.currency || "USD"}`,
        }))
        .filter((r: any) => {
          const diff = moment(r.end).diff(moment(r.start), "days");
          return diff >= nightsFrom && diff <= nightsTo;
        })
        .slice(0, 10);
      setResults(parsed);
    } catch (e) {
      console.error("flexible search failed", e);
      Alert.alert("Search failed. Please try again");
    }
    setLoading(false);
  };

  const selectRange = (r: FlexibleResult) => {
    setTripData((prev) => {
      const newData = prev.filter((item) => !item.dates);
      const totalDays = moment(r.end).diff(moment(r.start), "days") + 1;
      return [
        ...newData,
        {
          dates: {
            startDate: new Date(r.start),
            endDate: new Date(r.end),
            totalNumberOfDays: totalDays,
          },
        },
      ];
    });
    router.push("/create-trip/select-budget");
  };

  return (
    <SafeAreaView className="flex-1 p-6">
      <Text className="text-3xl font-outfit-bold mb-4">Flexible Dates</Text>
      <Text className="font-outfit text-gray-600 mb-4">
        Select a duration range and search for the most affordable date
        combinations.
      </Text>
      <View className="flex-row mb-4">
        {durationOptions.map((opt) => (
          <TouchableOpacity
            key={opt.label}
            onPress={() => setSelectedDuration(opt)}
            className={`px-4 py-2 mr-2 rounded-full border ${
              selectedDuration.label === opt.label
                ? "bg-pink-600 border-pink-600"
                : "border-gray-300"
            }`}
          >
            <Text
              className={`font-outfit-medium ${
                selectedDuration.label === opt.label ? "text-white" : "text-gray-600"
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mb-4">
        <Text className="font-outfit text-gray-600 mb-1">
          Or enter custom duration (days)
        </Text>
        <View className="flex-row space-x-2">
          <TextInput
            value={minDays}
            onChangeText={setMinDays}
            placeholder="Min days"
            keyboardType="numeric"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mb-2"
          />
          <TextInput
            value={maxDays}
            onChangeText={setMaxDays}
            placeholder="Max days"
            keyboardType="numeric"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mb-2"
          />
        </View>
      </View>
      <CustomButton title="Search" onPress={searchFlexible} disabled={loading} />
      {loading && <ActivityIndicator className="mt-4" color="#FF4698" />}
      <FlatList
        data={results}
        keyExtractor={(_, index) => index.toString()}
        className="mt-6"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => selectRange(item)}
            className="p-4 mb-3 bg-gray-50 rounded-xl border border-gray-100"
          >
            <Text className="font-outfit-bold">
              {item.start} - {item.end}
            </Text>
            <Text className="font-outfit text-gray-600">{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default FlexibleDates;
