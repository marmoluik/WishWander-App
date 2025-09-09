import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import CustomButton from "@/components/CustomButton";
import PreFlightChecklist from "@/components/PreFlightChecklist";

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

const TripDetails = () => {
  const router = useRouter();
  const { tripData, tripPlan } = useLocalSearchParams();

  const parsedTripData = tripData ? JSON.parse(tripData as string) : null;
  const parsedTripPlan = tripPlan ? JSON.parse(tripPlan as string) : null;

  const locationInfo = parsedTripData?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;
  const startDate = toDate(
    parsedTripData?.find((item: any) => item.dates)?.dates?.startDate
  );
  const endDate = toDate(
    parsedTripData?.find((item: any) => item.dates)?.dates?.endDate
  );
  const travelers = parsedTripData?.find(
    (item: any) => item.travelers
  )?.travelers;
  const totalNumberOfDays =
    startDate && endDate ? moment(endDate).diff(startDate, "days") + 1 : 0;
  const budget = parsedTripData?.find((item: any) => item.budget)?.budget?.type;

  const countryNameToCode: Record<string, string> = { Japan: "JP" };
  const destinationCode = countryNameToCode[locationInfo?.country as string] || "";
  const dateArr = [startDate, endDate].filter(Boolean) as Date[];

  return (
    <ScrollView className="flex-1 bg-background">
      <Image
        source={{
          uri: locationInfo?.photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${locationInfo.photoRef}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
            : DEFAULT_IMAGE_URL,
        }}
        className="w-full h-72"
      />

      <View className="p-6">
        <Text className="text-3xl font-outfit-bold">
          {parsedTripPlan?.trip_plan?.location ?? "Unknown"}
        </Text>

        <View className="mt-4 space-y-2">
          <Text className="text-lg font-outfit text-text-primary">
            {startDate ? moment(startDate).format("MMM D") : ""} -{" "}
            {endDate ? moment(endDate).format("MMM D, YYYY") : ""}
          </Text>
          <Text className="text-lg font-outfit text-text-primary">
            Total Number of Days: {totalNumberOfDays}
          </Text>
          <Text className="text-lg font-outfit text-text-primary">
            {travelers?.type} ({travelers?.count})
          </Text>
        <Text className="text-lg font-outfit text-text-primary">
          Budget Type: {budget ?? "N/A"}
        </Text>
        {destinationCode ? (
          <PreFlightChecklist destinationCountry={destinationCode} dates={dateArr} />
        ) : null}
        <View className="flex mt-10 items-center justify-center">
          <Text className="text-lg font-outfit-medium text-text-primary">
            Want to see flights, hotel recommendations and more plan details?
          </Text>
        </View>
        </View>

        <CustomButton
          title="Discover Location"
          onPress={() =>
            router.push({
              pathname: "/discover",
              params: { tripData, tripPlan },
            })
          }
          className="mt-7"
        />
      </View>
    </ScrollView>
  );
};

export default TripDetails;
