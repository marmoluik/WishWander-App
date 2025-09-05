import React, { useState } from 'react';
import { View, Text, Switch, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const [handsOff, setHandsOff] = useState(false);
  const [tripLimit, setTripLimit] = useState('');
  const [bookingLimit, setBookingLimit] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-3xl font-outfit-bold mb-8">Settings</Text>

        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-lg font-outfit">Hands-off Mode</Text>
          <Switch value={handsOff} onValueChange={setHandsOff} />
        </View>

        <View className="mb-6">
          <Text className="font-outfit mb-2">Trip Budget Limit</Text>
          <TextInput
            value={tripLimit}
            onChangeText={setTripLimit}
            placeholder="$"
            keyboardType="numeric"
            className="border p-2 rounded"
          />
        </View>

        <View className="mb-6">
          <Text className="font-outfit mb-2">Per Booking Limit</Text>
          <TextInput
            value={bookingLimit}
            onChangeText={setBookingLimit}
            placeholder="$"
            keyboardType="numeric"
            className="border p-2 rounded"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
