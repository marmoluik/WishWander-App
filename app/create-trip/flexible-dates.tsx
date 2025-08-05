import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
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

  const locationInfo = tripData.find((item) => item.locationInfo)?.locationInfo;
  const originAirport = tripData.find((item) => item.originAirport)?.originAirport;

  const searchFlexible = async () => {
    if (!originAirport || !locationInfo?.name) return;
    const rapidApiKey = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
    const rapidHost = "kiwi-com-cheap-flights.p.rapidapi.com";
    if (!rapidApiKey) return;

    setLoading(true);
    try {
      const locRes = await fetch(
        `https://${rapidHost}/locations?term=${encodeURIComponent(
          locationInfo.name
        )}&location_types=airport&limit=1`,
        {
          headers: {
            "X-RapidAPI-Key": rapidApiKey,
            "X-RapidAPI-Host": rapidHost,
          },
        }
      );
      const locJson = await locRes.json();
      const arrival = locJson.locations?.[0];
      if (!arrival?.code) {
        setLoading(false);
        return;
      }

      const today = moment().format("DD/MM/YYYY");
      const inSixMonths = moment().add(6, "months").format("DD/MM/YYYY");

      const searchUrl = `https://${rapidHost}/v2/search?fly_from=${originAirport.code}&fly_to=${arrival.code}&date_from=${today}&date_to=${inSixMonths}&nights_in_dst_from=${selectedDuration.from}&nights_in_dst_to=${selectedDuration.to}&limit=5&sort=price`;
      const flightRes = await fetch(searchUrl, {
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": rapidHost,
        },
      });
      const flightJson = await flightRes.json();
      const flights = flightJson.data || [];
      const parsed: FlexibleResult[] = flights.map((f: any) => ({
        start: moment(f.route?.[0]?.dTimeUTC * 1000).format("YYYY-MM-DD"),
        end: moment(f.route?.[1]?.aTimeUTC * 1000).format("YYYY-MM-DD"),
        price: `${f.price} ${f.currency}`,
      }));
      setResults(parsed);
    } catch (e) {
      console.error("flexible search failed", e);
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
                ? "bg-purple-600 border-purple-600"
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
      <CustomButton title="Search" onPress={searchFlexible} disabled={loading} />
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
