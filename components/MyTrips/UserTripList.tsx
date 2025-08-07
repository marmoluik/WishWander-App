import { View, Text, Image, Alert, TouchableOpacity } from "react-native";
import React from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import UserTripCard from "./UserTripCard";
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
const UserTripList = ({
  userTrips,
  onDelete,
}: {
  userTrips: any[];
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();

  // Sort trips by start date
  const sortedTrips = [...userTrips].sort((a, b) => {
    const aData = JSON.parse(a.tripData);
    const bData = JSON.parse(b.tripData);

    const aStartDate = toDate(
      aData.find((item: any) => item.dates)?.dates?.startDate
    );
    const bStartDate = toDate(
      bData.find((item: any) => item.dates)?.dates?.startDate
    );

    return moment(aStartDate).valueOf() - moment(bStartDate).valueOf();
  });

  const LatestTrip = JSON.parse(sortedTrips[0]?.tripData);

  const locationInfo = LatestTrip?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;

  const startDate = toDate(
    LatestTrip?.find((item: any) => item.dates)?.dates?.startDate
  );
  const endDate = toDate(
    LatestTrip?.find((item: any) => item.dates)?.dates?.endDate
  );
  const travelersType = LatestTrip?.find((item: any) => item.travelers)
    ?.travelers?.type;

  const isPastTrip = endDate ? moment().isAfter(moment(endDate)) : false;

  const viewLatestTrip = () =>
    router.push({
      pathname: "/trip-details",
      params: {
        tripData: sortedTrips[0].tripData,
        tripPlan: JSON.stringify(sortedTrips[0].tripPlan),
      },
    });

  return (
    <View className="mb-16">
      <View>
        <View className="relative">
          <TouchableOpacity onPress={viewLatestTrip}>
            <Image
              source={{
                uri: locationInfo?.photoRef
                  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
                  : DEFAULT_IMAGE_URL,
              }}
              className={`w-full h-60 rounded-2xl mt-5 ${
                isPastTrip ? "grayscale" : ""
              }`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(sortedTrips[0].id) },
              ])
            }
            className="absolute top-3 right-3 bg-background rounded-full"
          >
            <Ionicons name="close" size={24} color="#9C00FF" />
          </TouchableOpacity>
        </View>
        <View className="mt-3">
          <Text className="font-outfit-medium text-xl text-text-primary">
            {sortedTrips[0]?.tripPlan?.trip_plan?.location}
          </Text>
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="font-outfit text-lg text-text-primary">
              {startDate ? moment(startDate).format("DD MMM yyyy") : ""}
            </Text>
            <Text className="font-outfit-medium mr-5 text-lg text-text-primary">
              🚌 {travelersType}
            </Text>
          </View>

          <CustomButton
            title="View Trip"
            onPress={viewLatestTrip}
            bgVariant="outline"
            textVariant="primary"
            className={`mt-3 ${isPastTrip ? "opacity-50" : ""}`}
          />
        </View>

        <View className="h-0.5 bg-primary mt-4 mb-2" />

        {sortedTrips?.slice(1).map((trip, idx) => (
          <UserTripCard trip={trip} key={idx} onDelete={onDelete} />
        ))}
      </View>
    </View>
  );
};

export default UserTripList;
