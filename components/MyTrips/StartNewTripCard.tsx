import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";

const StartNewTripCard = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const handleStartNewTrip = () => {
    setTripData([]); // Clear trip data
    router.push("/create-trip/search-place");
  };

  return (
    <View className="p-5 flex items-center justify-center gap-5 h-full">
      <FontAwesome6 name="map-location-dot" size={50} color="#8b5cf6" />
      <Text className="font-outfit-bold text-purple-700 text-xl">
        No Trips planned yet
      </Text>
      <Text className="font-outfit-medium text-gray-500 text-center w-4/5">
        Plan your next trip by clicking on the button below
      </Text>
      <CustomButton
        title="Start New Trip"
        onPress={handleStartNewTrip}
        bgVariant="primary"
        className="mt-5"
      />
    </View>
  );
};

export default StartNewTripCard;
