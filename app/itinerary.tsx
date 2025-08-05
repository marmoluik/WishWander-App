import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import moment from 'moment';

const PERIODS = ['Morning', 'Afternoon', 'Evening', 'Night'];

interface DayPlan {
  date: string;
  activities: { period: string; activity: string }[];
  food: string;
  stay: string;
  optional: string[];
  tips: string;
}

const buildItinerary = (start: Date, places: any[]): DayPlan[] => {
  const days: DayPlan[] = [];
  let idx = 0;
  const totalDays = Math.max(1, Math.ceil(places.length / PERIODS.length));
  for (let d = 0; d < totalDays; d++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + d);
    const activities = PERIODS.map((p) => {
      const place = places[idx++];
      return { period: p, activity: place ? place.name : 'Free Time' };
    });
    days.push({
      date: dayDate.toISOString(),
      activities,
      food: 'TBD',
      stay: 'TBD',
      optional: [],
      tips: 'Enjoy your day!'
    });
  }
  return days;
};

export default function Itinerary() {
  const { places, tripData } = useLocalSearchParams();
  const selectedPlaces = places ? JSON.parse(places as string) : [];
  const parsedTripData = tripData ? JSON.parse(tripData as string) : [];
  const startDate = parsedTripData.find((i: any) => i.dates)?.dates?.startDate
    ? new Date(parsedTripData.find((i: any) => i.dates).dates.startDate)
    : new Date();
  const [collapsed, setCollapsed] = useState(false);
  const [days, setDays] = useState<DayPlan[]>(buildItinerary(startDate, selectedPlaces));

  const addDay = () => {
    const last = days[days.length - 1];
    const next = new Date(last.date);
    next.setDate(next.getDate() + 1);
    setDays([
      ...days,
      {
        date: next.toISOString(),
        activities: PERIODS.map((p) => ({ period: p, activity: 'Free Time' })),
        food: '',
        stay: '',
        optional: [],
        tips: ''
      }
    ]);
  };

  const moveDay = (index: number, dir: number) => {
    const copy = [...days];
    const target = index + dir;
    if (target < 0 || target >= copy.length) return;
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    setDays(copy);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24, paddingTop: 80 }}>
      <View className="mb-4 flex-row justify-between">
        <CustomButton title="Add Day" onPress={addDay} className="mr-2 flex-1" />
        <CustomButton
          title={collapsed ? 'Expand All' : 'Collapse All'}
          onPress={() => setCollapsed(!collapsed)}
          bgVariant="secondary"
          className="flex-1"
        />
      </View>
      {days.map((day, index) => (
        <View key={index} className="mb-4 p-4 border border-gray-200 rounded-xl">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-outfit-bold">
              Day {index + 1} - {moment(day.date).format('MMM D, YYYY')}
            </Text>
            <View className="flex-row">
              <TouchableOpacity onPress={() => moveDay(index, -1)} className="mr-2">
                <Text className="text-purple-500">↑</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveDay(index, 1)}>
                <Text className="text-purple-500">↓</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!collapsed && (
            <View>
              {day.activities.map((act, i) => (
                <Text key={i} className="font-outfit text-gray-700">
                  {act.period}: {act.activity}
                </Text>
              ))}
              <Text className="font-outfit text-gray-700 mt-2">
                Food Recommendation: {day.food || 'TBD'}
              </Text>
              <Text className="font-outfit text-gray-700">
                Stay Option: {day.stay || 'TBD'}
              </Text>
              {day.optional.length > 0 && (
                <View className="mt-2">
                  <Text className="font-outfit font-bold">Optional Activities:</Text>
                  {day.optional.map((op, j) => (
                    <Text key={j} className="font-outfit text-gray-700">• {op}</Text>
                  ))}
                </View>
              )}
              <Text className="font-outfit text-gray-700 mt-2">Travel Tips: {day.tips || 'TBD'}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
