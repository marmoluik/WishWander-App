import { View, Text, ScrollView, Image, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import moment from "moment";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=2071&auto=format&fit=crop";

const Discover = () => {
  const { tripData, tripPlan } = useLocalSearchParams();
  const [parsedTripData, setParsedTripData] = useState<any>(null);
  const [parsedTripPlan, setParsedTripPlan] = useState<any>(null);

  const fetchPlaceImage = async (placeName: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          placeName
        )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0] && data.results[0].photos) {
        const photoReference = data.results[0].photos[0].photo_reference;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY}`;
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
      setParsedTripData(JSON.parse(tripData as string));
      setParsedTripPlan(parsedTrip);

      // Fetch images for hotels
      parsedTrip.trip_plan.hotel.options.forEach(
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
      parsedTrip.trip_plan.places_to_visit.forEach(
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

  if (!parsedTripPlan || !parsedTripData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-outfit-medium text-gray-600">
          Select a trip to view details
        </Text>
      </View>
    );
  }

  const handleOpenMap = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{
        padding: 24,
        paddingTop: 80,
        paddingBottom: 20,
      }}
    >
      <Text className="text-3xl font-outfit-bold mb-6">Trip Details</Text>

      {/* Trip Overview */}
      <View className="bg-purple-50 p-4 rounded-xl mb-6">
        <Text className="font-outfit-bold text-lg mb-2">Trip Overview</Text>
        <Text className="font-outfit text-gray-600">
          Duration: {parsedTripPlan.trip_plan.duration}
        </Text>
        <Text className="font-outfit text-gray-600">
          Budget: {parsedTripPlan.trip_plan.budget}
        </Text>
        {/* <Text className="font-outfit text-gray-600">
          Group Size: {parsedTripPlan.group_size}
        </Text> */}
      </View>

      {/* Flight Details */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Flight Details</Text>
        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="font-outfit-bold text-lg">
                {parsedTripPlan.trip_plan.flight_details.departure_city}
              </Text>
              <Text className="font-outfit text-gray-600">
                {parsedTripPlan.trip_plan.flight_details.departure_date}{" "}
                {parsedTripPlan.trip_plan.flight_details.departure_time}
              </Text>
            </View>
            <Ionicons name="airplane" size={24} color="#8b5cf6" />
            <View>
              <Text className="font-outfit-bold text-lg">
                {parsedTripPlan.trip_plan.flight_details.arrival_city}
              </Text>
              <Text className="font-outfit text-gray-600">
                {parsedTripPlan.trip_plan.flight_details.arrival_date}{" "}
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
            <CustomButton
              title="Book Flight"
              onPress={() =>
                Linking.openURL(
                  parsedTripPlan.trip_plan.flight_details.booking_url
                )
              }
              className="mt-4"
            />
          </View>
        </View>
      </View>

      {/* Hotels Section */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Hotel Options</Text>
        {parsedTripPlan.trip_plan.hotel.options.map(
          (hotel: any, index: number) => (
            <View
              key={index}
              className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100"
            >
              <Image
                source={{ uri: hotel.image_url }}
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
                    hotel.geo_coordinates.longitude
                  )
                }
                className="mt-4"
              />
            </View>
          )
        )}
      </View>

      {/* Places to Visit */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Places to Visit</Text>
        {parsedTripPlan.trip_plan.places_to_visit.map(
          (place: any, index: number) => (
            <View
              key={index}
              className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100"
            >
              <Image
                source={{ uri: place.image_url }}
                className="w-full h-48 rounded-xl mb-4"
              />
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
                    place.geo_coordinates.longitude
                  )
                }
                className="mt-4"
              />
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default Discover;
