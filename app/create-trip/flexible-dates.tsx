import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { CreateTripContext } from '@/context/CreateTripContext';
import { searchCheapestDateRanges, FlexibleDateRange } from '@/utils/flexibleDates';

const DURATIONS = [
  { label: '5-7 days', range: [5, 7] as [number, number] },
  { label: '7-10 days', range: [7, 10] as [number, number] },
  { label: '10-14 days', range: [10, 14] as [number, number] },
];

export default function FlexibleDates() {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const origin = tripData.find((t: any) => t.originAirport)?.originAirport;
  const destination = tripData.find((t: any) => t.locationInfo)?.locationInfo;

  const [duration, setDuration] = useState<[number, number]>(DURATIONS[0].range);
  const [options, setOptions] = useState<FlexibleDateRange[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    const res = await searchCheapestDateRanges(origin.code, destination.code || destination.name, duration);
    setOptions(res);
    setLoading(false);
  };

  const selectRange = (range: FlexibleDateRange) => {
    setTripData((prev: any[]) => {
      const filtered = prev.filter((p) => !p.dates);
      return [
        ...filtered,
        {
          dates: {
            startDate: new Date(range.startDate),
            endDate: new Date(range.endDate),
            totalNumberOfDays:
              Math.round(
                (new Date(range.endDate).getTime() - new Date(range.startDate).getTime()) / 86400000
              ) + 1,
          },
        },
      ];
    });
    router.push('/create-trip/select-budget');
  };

  const isSelected = (r: [number, number]) => r[0] === duration[0] && r[1] === duration[1];

  return (
    <SafeAreaView className="flex-1 p-6">
      <Text className="text-3xl font-outfit-bold mb-4">Flexible Dates</Text>
      <Text className="font-outfit text-gray-600 mb-2">Select trip duration</Text>
      <View className="flex-row flex-wrap mb-4">
        {DURATIONS.map((d) => (
          <TouchableOpacity
            key={d.label}
            onPress={() => setDuration(d.range)}
            className={`px-3 py-2 mr-2 mb-2 rounded-full border ${
              isSelected(d.range) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
            }`}
          >
            <Text
              className={`font-outfit ${isSelected(d.range) ? 'text-white' : 'text-gray-600'}`}
            >
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <CustomButton title="Search" onPress={search} disabled={loading || !origin} />
      {loading && (
        <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 16 }} />
      )}
      <FlatList
        data={options}
        keyExtractor={(item) => item.startDate + item.endDate}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => selectRange(item)}
            className="p-4 border-b border-gray-200"
          >
            <Text className="font-outfit">
              {item.startDate} - {item.endDate}
            </Text>
            <Text className="font-outfit text-gray-600">${item.price}</Text>
          </TouchableOpacity>
        )}
        className="mt-4"
      />
    </SafeAreaView>
  );
}
