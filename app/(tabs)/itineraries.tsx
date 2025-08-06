import React, { useContext } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ItineraryContext } from "@/context/ItineraryContext";
import ItineraryDetails from "@/components/ItineraryDetails";

const Itineraries = () => {
  const { itinerary } = useContext(ItineraryContext);

  return (
    <SafeAreaView className="flex-1 p-4">
      {itinerary ? (
        <ItineraryDetails plan={itinerary} />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="font-outfit text-gray-600">No itinerary saved.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Itineraries;
