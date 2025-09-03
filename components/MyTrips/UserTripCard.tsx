import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import React from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=2071&auto=format&fit=crop";

const toDate = (value: any) => {
  if (!value) return undefined;
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }
  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }
  if (value._seconds) {
    return new Date(value._seconds * 1000);
  }
  return undefined;
};

const UserTripCard = ({
  trip,
  onDelete,
}: {
  trip: any;
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();

  const tripData = JSON.parse(trip?.tripData);
  const locationInfo = tripData?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;
  const startDateRaw = tripData?.find((item: any) => item.dates)?.dates?.startDate;
  const endDateRaw = tripData?.find((item: any) => item.dates)?.dates?.endDate;
  const startDate = toDate(startDateRaw);
  const endDate = toDate(endDateRaw);

  const isPastTrip = endDate ? moment().isAfter(moment(endDate)) : false;

  const viewTrip = () =>
    router.push({
      pathname: "/trip-details",
      params: {
        tripData: trip.tripData,
        tripPlan: JSON.stringify(trip.tripPlan),
      },
    });

  return (
    <View className="mt-5 flex flex-row gap-3">
      <View className="w-32 h-32 relative">
        <TouchableOpacity onPress={viewTrip}>
          <Image
            source={{
              uri: locationInfo?.photoRef
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
                : DEFAULT_IMAGE_URL,
            }}
            className={`w-full h-full rounded-2xl ${
              isPastTrip ? "grayscale" : ""
            }`}
          />
        </TouchableOpacity>
        {trip?.conciergeActive && (
          <View className="absolute bottom-1 left-1 bg-purple-600 px-2 py-1 rounded">
            <Text className="text-white text-xs">Priority</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(trip.id),
              },
            ])
          }
          className="absolute top-1 right-1 bg-background rounded-full"
        >
          <Ionicons name="close" size={20} color="#9C00FF" />
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <Text
          className="font-outfit-medium text-lg text-text-primary"
          numberOfLines={2}
        >
          {trip?.tripPlan?.trip_plan?.location}
        </Text>
        <Text className="font-outfit text-md text-text-primary mt-1">
          {startDate ? moment(startDate).format("DD MMM yyyy") : ""}
        </Text>
        <Text className="font-outfit-medium text-md text-text-primary mt-1">
          {trip?.tripPlan?.trip_plan?.group_size?.split(" ")[0] ?? "N/A"}
        </Text>
      </View>
      <View className="flex-1">
        <CustomButton
          title="View Trip"
          onPress={viewTrip}
          disabled={isPastTrip}
          bgVariant="outline"
          textVariant="primary"
          className={`mt-2 py-0.5 ${isPastTrip ? "opacity-50" : ""}`}
        />
      </View>
    </View>
  );
};

export default UserTripCard;
