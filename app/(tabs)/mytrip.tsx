import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import StartNewTripCard from "@/components/MyTrips/StartNewTripCard";

const MyTrip = () => {
  const [userTrips, setUserTrips] = useState([]);

  return (
    <SafeAreaView className="p-6 h-full">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-3xl font-outfit-bold text-purple-700">
          My Trip
        </Text>
        <Ionicons name="add-circle" size={36} color="#8b5cf6" />
      </View>

      {userTrips?.length == 0 && <StartNewTripCard />}
    </SafeAreaView>
  );
};

export default MyTrip;
