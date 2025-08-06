import {
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { interestCategories } from "@/constants/Options";

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

const Discover = () => {
  const { tripData, tripPlan } = useLocalSearchParams();
  const router = useRouter();
  const [parsedTripData, setParsedTripData] = useState<any>(null);
  const [parsedTripPlan, setParsedTripPlan] = useState<any>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);

  const fetchPlaceImage = async (placeName: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          placeName
        )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0] && data.results[0].photos) {
        const photoReference = data.results[0].photos[0].photo_reference;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      }
      return DEFAULT_IMAGE_URL;
    } catch (error) {
      console.error("Error fetching place image:", error);
      return DEFAULT_IMAGE_URL;
    }
  };

  useEffect(() => {
    if (tripData && tripPlan) {
      const parsedTrip = JSON.parse(tripPlan as string);
      const parsedData = JSON.parse(tripData as string);
      setParsedTripData(parsedData);
      setParsedTripPlan(parsedTrip);

      // Fetch images for hotels
      parsedTrip?.trip_plan?.hotel?.options?.forEach(
        async (hotel: any, index: number) => {
          const imageUrl = await fetchPlaceImage(hotel.name);
          setParsedTripPlan((prev: any) => ({
            ...prev,
            trip_plan: {
              ...prev.trip_plan,
              hotel: {
                ...prev.trip_plan.hotel,
                options: prev.trip_plan.hotel.options.map((h: any, i: number) =>
                  i === index ? { ...h, image_url: imageUrl } : h
                ),
              },
            },
          }));
        }
      );

      // Fetch images for places to visit
      parsedTrip?.trip_plan?.places_to_visit?.forEach(
        async (place: any, index: number) => {
          const imageUrl = await fetchPlaceImage(place.name);
          setParsedTripPlan((prev: any) => ({
            ...prev,
            trip_plan: {
              ...prev.trip_plan,
              places_to_visit: prev.trip_plan.places_to_visit.map(
                (p: any, i: number) =>
                  i === index ? { ...p, image_url: imageUrl } : p
              ),
            },
          }));
        }
      );
    }
  }, [tripData, tripPlan]);

  const filteredPlaces =
    parsedTripPlan?.trip_plan?.places_to_visit?.filter((p: any) =>
      selectedInterests.length === 0
        ? true
        : selectedInterests.some((i) => p.categories?.includes(i))
    ) || [];

  if (!parsedTripPlan || !parsedTripData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-outfit-medium text-gray-600">
          Select a trip to view details
        </Text>
      </View>
    );
  }

  const handleOpenMap = (
    latitude: number,
    longitude: number,
    name?: string
  ) => {
    const query = name ? encodeURIComponent(name) : `${latitude},${longitude}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const generateBookingUrl = (hotelName: string) => {
    const affiliateId = process.env.EXPO_PUBLIC_BOOKING_AFFILIATE_ID;
    const encodedName = encodeURIComponent(hotelName);
    return `https://www.booking.com/searchresults.html?ss=${encodedName}${
      affiliateId ? `&aid=${affiliateId}` : ""
    }`;
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const togglePlace = (place: any) => {
    setSelectedPlaces((prev) => {
      const exists = prev.find((p) => p.name === place.name);
      if (exists) {
        return prev.filter((p) => p.name !== place.name);
      }
      return [...prev, place];
    });
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingTop: 80,
          paddingBottom: selectedPlaces.length > 0 ? 100 : 20,
        }}
      >
      <Text className="text-3xl font-outfit-bold mb-6">Trip Details</Text>

      {/* Trip Overview */}
      <View className="bg-purple-50 p-4 rounded-xl mb-6">
        <Text className="font-outfit-bold text-lg mb-2">Trip Overview</Text>
        <Text className="font-outfit text-gray-600">
          Duration: {parsedTripPlan?.trip_plan?.duration ?? "N/A"}
        </Text>
        <Text className="font-outfit text-gray-600">
          Budget: {parsedTripPlan?.trip_plan?.budget ?? "N/A"}
        </Text>
        {/* <Text className="font-outfit text-gray-600">
          Group Size: {parsedTripPlan.group_size}
        </Text> */}
      </View>

      {/* Flight Details */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Flight Details</Text>
        {parsedTripPlan?.trip_plan?.flight_details ? (
          <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="flex-1 pr-2">
                <Text
                  className="font-outfit-bold text-lg"
                  numberOfLines={1}
                >
                  {parsedTripPlan.trip_plan.flight_details.departure_city}
                </Text>
                <Text className="font-outfit text-gray-600">
                  {
                    toDate(
                      parsedTripPlan.trip_plan.flight_details.departure_date
                    )?.toLocaleDateString() || ""
                  }{" "}
                  {parsedTripPlan.trip_plan.flight_details.departure_time}
                </Text>
              </View>
              <Ionicons name="airplane" size={24} color="#8b5cf6" />
              <View className="flex-1 pl-2 items-end">
                <Text
                  className="font-outfit-bold text-lg text-right"
                  numberOfLines={1}
                >
                  {parsedTripPlan.trip_plan.flight_details.arrival_city}
                </Text>
                <Text className="font-outfit text-gray-600 text-right">
                  {
                    toDate(
                      parsedTripPlan.trip_plan.flight_details.arrival_date
                    )?.toLocaleDateString() || ""
                  }{" "}
                  {parsedTripPlan.trip_plan.flight_details.arrival_time}
                </Text>
              </View>
            </View>
            <View className="border-t border-gray-200 pt-4">
              <Text className="font-outfit text-gray-600">
                Airline: {parsedTripPlan.trip_plan.flight_details.airline}
              </Text>
              <Text className="font-outfit text-gray-600">
                Flight: {parsedTripPlan.trip_plan.flight_details.flight_number}
              </Text>
              <Text className="font-outfit text-gray-600">
                Price: {parsedTripPlan.trip_plan.flight_details.price}
              </Text>
              {parsedTripPlan.trip_plan.flight_details.booking_url ? (
                <CustomButton
                  title="Book Flight"
                  onPress={() =>
                    Linking.openURL(
                      parsedTripPlan.trip_plan.flight_details.booking_url
                    )
                  }
                  className="mt-4"
                />
              ) : (
                <Text className="font-outfit text-gray-600 mt-4">
                  No flight offer available.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text className="font-outfit text-gray-600">
            No flight details available.
          </Text>
        )}
      </View>

      {/* Hotels Section */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Hotel Options</Text>
        {parsedTripPlan?.trip_plan?.hotel?.options?.length ? (
          parsedTripPlan.trip_plan.hotel.options.map(
            (hotel: any, index: number) => (
              <View
                key={index}
                className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100"
              >
                <Image
                  source={{ uri: hotel.image_url || DEFAULT_IMAGE_URL }}
                  className="w-full h-48 rounded-xl mb-4"
                />
                <Text className="font-outfit-bold text-lg">{hotel.name}</Text>
                <Text className="font-outfit text-gray-600 mb-2">
                  {hotel.address}
                </Text>
                <Text className="font-outfit text-gray-600">
                  Price: {hotel.price}
                </Text>
                <Text className="font-outfit text-gray-600">
                  Rating: {hotel.rating} ⭐
                </Text>
                <Text className="font-outfit text-gray-600 mt-2">
                  {hotel.description}
                </Text>
                <CustomButton
                  title="View on Map"
                  onPress={() =>
                    handleOpenMap(
                      hotel.geo_coordinates.latitude,
                      hotel.geo_coordinates.longitude,
                      hotel.name
                    )
                  }
                  className="mt-4"
                />
                <CustomButton
                  title="Book Hotel"
                  onPress={() =>
                    Linking.openURL(generateBookingUrl(hotel.name))
                  }
                  className="mt-2"
                />
              </View>
            )
          )
        ) : (
          <Text className="font-outfit text-gray-600">
            No hotel options available.
          </Text>
        )}
      </View>

      {/* Places to Visit */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Places to Visit</Text>
        <Text className="font-outfit mb-2 text-gray-700">Filter by:</Text>
        <View className="flex-row flex-wrap mb-2">
          {interestCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => toggleInterest(cat)}
              className={`px-3 py-1 m-1 rounded-full border ${
                selectedInterests.includes(cat)
                  ? "bg-purple-600 border-purple-600"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={`font-outfit ${
                  selectedInterests.includes(cat)
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="font-outfit text-gray-600 mb-4">
          Tap + to add a place to your itinerary.
        </Text>
        {filteredPlaces.length ? (
          filteredPlaces.map((place: any, index: number) => {
            const isSelected = selectedPlaces.find(
              (p) => p.name === place.name
            );
            return (
              <View
                key={index}
                className={`p-4 rounded-xl mb-4 border ${
                  isSelected
                    ? "bg-purple-50 border-purple-500"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <Image
                  source={{ uri: place.image_url || DEFAULT_IMAGE_URL }}
                  className="w-full h-48 rounded-xl mb-4"
                />
                <TouchableOpacity
                  onPress={() => togglePlace(place)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-md items-center justify-center ${
                    isSelected
                      ? "bg-purple-600"
                      : "bg-white border border-purple-600"
                  }`}
                >
                  <Ionicons
                    name={isSelected ? "checkmark" : "add"}
                    size={20}
                    color={isSelected ? "#ffffff" : "#8b5cf6"}
                  />
                </TouchableOpacity>
                <Text className="font-outfit-bold text-lg">{place.name}</Text>
                <Text className="font-outfit text-gray-600 mb-2">
                  {place.details}
                </Text>
                <Text className="font-outfit text-gray-600">
                  Ticket Price: {place.ticket_price}
                </Text>
                <Text className="font-outfit text-gray-600">
                  Time to Travel: {place.time_to_travel}
                </Text>
                <CustomButton
                  title="View on Map"
                  onPress={() =>
                    handleOpenMap(
                      place.geo_coordinates.latitude,
                      place.geo_coordinates.longitude,
                      place.name
                    )
                  }
                  className="mt-4"
                />
              </View>
            );
          })
        ) : (
          <Text className="font-outfit text-gray-600">
            No places to visit available.
          </Text>
        )}
      </View>
    </ScrollView>
    {selectedPlaces.length > 0 && (
      <View className="absolute bottom-4 left-0 right-0 px-6">
        <CustomButton
          title="Generate Itinerary"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/itineraries",
              params: {
                selectedPlaces: JSON.stringify(selectedPlaces),
                tripData,
              },
            })
          }
        />
      </View>
    )}
  </View>
  );
};

export default Discover;
