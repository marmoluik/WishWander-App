import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import CustomButton from "@/components/CustomButton";

const ReviewTrip = () => {
  const router = useRouter();
  const { tripData } = useContext(CreateTripContext);

  // Find the specific data from tripData array
  const locationInfo = tripData.find((item) => item.locationInfo)?.locationInfo;
  const travelers = tripData.find((item) => item.travelers)?.travelers;
  const dates = tripData.find((item) => item.dates)?.dates;
  const budget = tripData.find((item) => item.budget)?.budget;

  // Use useEffect to update the data whenever tripData changes
  useEffect(() => {
    // This will re-render the component whenever tripData changes
  }, [tripData]);

  const renderReviewItem = (
    title: string,
    value: string,
    icon: React.ReactNode,
    editPath: string
  ) => (
    <View className="flex-row items-center justify-between bg-background p-4 rounded-xl mb-4 shadow-sm border border-primary">
      <View className="flex-row items-center flex-1">
        <View className="bg-secondary p-3 rounded-full">{icon}</View>
        <View className="ml-4 flex-1">
          <Text className="text-text-primary text-sm font-outfit">{title}</Text>
          <Text className="text-lg font-outfit-bold">{value}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push(editPath as any)}
        className="bg-primary p-2 rounded-full"
      >
        <MaterialIcons name="edit" size={20} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="p-6">
        <Text className="text-5xl font-outfit-bold mb-2">Review Your Trip</Text>
        <Text className="text-text-primary font-outfit-medium mb-8">
          You can always edit your trip details
        </Text>

        {renderReviewItem(
          "Destination",
          locationInfo?.name || "Not selected",
          <Ionicons name="location-sharp" size={24} color="#3B82F6" />, 
          "/create-trip/search-place"
        )}

        {renderReviewItem(
          "Travelers",
          `${travelers?.type || "Not selected"} (${travelers?.count || "0"})`,
          <MaterialIcons name="people" size={24} color="#3B82F6" />, 
          "/create-trip/select-traveler"
        )}

        {renderReviewItem(
          "Dates",
          dates
            ? `${moment(dates.startDate).format("MMM D")} - ${moment(
                dates.endDate
              ).format("MMM D, YYYY")} (${dates.totalNumberOfDays} days)`
            : "Not selected",
          <FontAwesome5 name="calendar-alt" size={24} color="#3B82F6" />, 
          "/create-trip/select-dates"
        )}

        {renderReviewItem(
          "Budget",
          budget?.type || "Not selected",
          <MaterialIcons
            name="account-balance-wallet"
            size={24}
            color="#3B82F6"
          />,
          "/create-trip/select-budget"
        )}
      </View>

      <View className="p-6">
        <CustomButton
          title="Build an itinerary"
          onPress={() => router.replace("/generate-trip")}
        />
      </View>
    </SafeAreaView>
  );
};

export default ReviewTrip;
