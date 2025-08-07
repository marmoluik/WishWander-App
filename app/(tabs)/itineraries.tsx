import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { DayPlan } from '@/types/Trip';

const Itineraries = () => {
  const { tripId } = useLocalSearchParams();
  const [plan, setPlan] = useState<DayPlan[]>([]);

  useEffect(() => {
    if (!tripId || !db) return;
    const ref = collection(db, 'trips', tripId as string, 'itinerary');
    const unsub = onSnapshot(ref, (snapshot) => {
      const days: DayPlan[] = [];
      snapshot.forEach((doc) => days.push(doc.data() as DayPlan));
      days.sort((a, b) => a.day - b.day);
      setPlan(days);
    });
    return () => unsub();
  }, [tripId]);

  if (!tripId) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="font-outfit text-text-primary">
          Select a trip to view itinerary.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <FlatList
        data={plan}
        keyExtractor={(item) => item.day.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-background rounded-xl">
            <Text className="font-outfit-bold mb-2">
              Day {item.day}: {item.date}
            </Text>
            <Text className="font-outfit">Morning: {item.schedule.morning}</Text>
            <Text className="font-outfit">Afternoon: {item.schedule.afternoon}</Text>
            <Text className="font-outfit">Evening: {item.schedule.evening}</Text>
            <Text className="font-outfit">Night: {item.schedule.night}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Itineraries;
