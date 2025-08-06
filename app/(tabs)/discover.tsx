import {
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { interestCategories } from "@/constants/Options";
import { generateHotelLink, generatePoiLink } from "@/utils/travelpayouts";

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
  const hotelListRef = useRef<FlatList<any>>(null);
  const [hotelIndex, setHotelIndex] = useState(0);

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

  const availableCategories = interestCategories.filter((cat) =>
    parsedTripPlan?.trip_plan?.places_to_visit?.some((p: any) =>
      p.categories?.includes(cat)
    )
  );

  const hotelOptions =
    parsedTripPlan?.trip_plan?.hotel?.options?.slice(0, 10) || [];
  const ITEM_WIDTH = 304;
  const scrollHotels = (dir: number) => {
    const newIndex = Math.min(
      Math.max(hotelIndex + dir, 0),
      hotelOptions.length - 1
    );
    hotelListRef.current?.scrollToOffset({
      offset: newIndex * ITEM_WIDTH,
      animated: true,
    });
    setHotelIndex(newIndex);
  };

  if (!parsedTripPlan || !parsedTripData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-outfit-medium text-text-primary">
          Select a trip to view details
        </Text>
      </View>
    );
  }

  const handleOpenMap = (
    address?: string,
    latitude?: number,
    longitude?: number
  ) => {
    const query = address
      ? encodeURIComponent(address)
      : `${latitude},${longitude}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
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
    <View className="flex-1 bg-background">
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
      <View className="bg-secondary p-4 rounded-xl mb-6">
        <Text className="font-outfit-bold text-lg mb-2">Trip Overview</Text>
        <Text className="font-outfit text-text-primary">
          Duration: {parsedTripPlan?.trip_plan?.duration ?? "N/A"}
        </Text>
        <Text className="font-outfit text-text-primary">
          Budget: {parsedTripPlan?.trip_plan?.budget ?? "N/A"}
        </Text>
        {/* <Text className="font-outfit text-text-primary">
          Group Size: {parsedTripPlan.group_size}
        </Text> */}
      </View>

      {/* Flight Details */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Flight Details</Text>
        {parsedTripPlan?.trip_plan?.flight_details ? (
          <View className="bg-background p-4 rounded-xl border border-primary">
            <View className="flex-row items-center mb-4">
              <View className="flex-1 pr-2">
                <Text
                  className="font-outfit-bold text-lg"
                  numberOfLines={1}
                >
                  {parsedTripPlan.trip_plan.flight_details.departure_city}
                </Text>
                <Text className="font-outfit text-text-primary">
                  {
                    toDate(
                      parsedTripPlan.trip_plan.flight_details.departure_date
                    )?.toLocaleDateString() || ""
                  }{" "}
                  {parsedTripPlan.trip_plan.flight_details.departure_time}
                </Text>
              </View>
              <Ionicons name="airplane" size={24} color="#F59E0B" />
              <View className="flex-1 pl-2 items-end">
                <Text
                  className="font-outfit-bold text-lg text-right"
                  numberOfLines={1}
                >
                  {parsedTripPlan.trip_plan.flight_details.arrival_city}
                </Text>
                <Text className="font-outfit text-text-primary text-right">
                  {
                    toDate(
                      parsedTripPlan.trip_plan.flight_details.arrival_date
                    )?.toLocaleDateString() || ""
                  }{" "}
                  {parsedTripPlan.trip_plan.flight_details.arrival_time}
                </Text>
              </View>
            </View>
            <View className="border-t border-secondary pt-4">
              <Text className="font-outfit text-text-primary">
                Airline:{" "}
                {parsedTripPlan.trip_plan.flight_details.airline || "N/A"}
              </Text>
              <Text className="font-outfit text-text-primary">
                Flight:{" "}
                {parsedTripPlan.trip_plan.flight_details.flight_number || "N/A"}
              </Text>
              <Text className="font-outfit text-text-primary">
                Price:{" "}
                {parsedTripPlan.trip_plan.flight_details.price || "N/A"}
              </Text>
              {parsedTripPlan.trip_plan.flight_details.booking_url?.startsWith(
                "http"
              ) ? (
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
                <Text className="font-outfit text-text-primary mt-4">
                  No flight offer available.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text className="font-outfit text-text-primary">
            No flight details available.
          </Text>
        )}
      </View>

      {/* Hotels Section */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Hotel Options</Text>
        {hotelOptions.length ? (
          <>
            <View className="flex-row items-center">
              {hotelIndex > 0 && (
                <TouchableOpacity
                  onPress={() => scrollHotels(-1)}
                  className="mr-2"
                >
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              )}
              <FlatList
                ref={hotelListRef}
                data={hotelOptions}
                horizontal
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <View className="w-72 mr-4 bg-background p-4 rounded-xl border border-primary">
                    <Image
                      source={{ uri: item.image_url || DEFAULT_IMAGE_URL }}
                      className="w-full h-48 rounded-xl mb-4"
                    />
                    <Text className="font-outfit-bold text-lg">{item.name}</Text>
                    <Text className="font-outfit text-text-primary mb-2">
                      {item.address}
                    </Text>
                    <Text className="font-outfit text-text-primary">
                      Price: {item.price}
                    </Text>
                    <Text className="font-outfit text-text-primary">
                      Rating: {item.rating} ⭐
                    </Text>
                    <Text className="font-outfit text-text-primary mt-2">
                      {item.description}
                    </Text>
                    <CustomButton
                      title="View on Map"
                      onPress={() => handleOpenMap(item.address)}
                      className="mt-4"
                    />
                    <CustomButton
                      title="Book Hotel"
                      onPress={() =>
                        Linking.openURL(
                          generateHotelLink(
                            `${item.name} ${parsedTripPlan.trip_plan.location}`
                          )
                        )
                      }
                      className="mt-2"
                    />
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
              {hotelIndex < hotelOptions.length - 1 && (
                <TouchableOpacity onPress={() => scrollHotels(1)} className="ml-2">
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color="#F59E0B"
                  />
                </TouchableOpacity>
              )}
            </View>
            <CustomButton
              title="See More Hotels"
              onPress={() =>
                Linking.openURL(
                  generateHotelLink(parsedTripPlan.trip_plan.location)
                )
              }
              bgVariant="outline"
              textVariant="primary"
              className="mt-4"
            />
          </>
        ) : (
          <Text className="font-outfit text-text-primary">
            No hotel options available.
          </Text>
        )}
      </View>

      {/* Places to Visit */}
      <View className="mb-8">
        <Text className="text-2xl font-outfit-bold mb-4">Places to Visit</Text>
        {availableCategories.length > 0 && (
          <>
            <Text className="font-outfit mb-2">Filter by:</Text>
            <View className="flex-row flex-wrap mb-2">
              {availableCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => toggleInterest(cat)}
                  className={`px-3 py-1 m-1 rounded-full border ${
                    selectedInterests.includes(cat)
                      ? "bg-primary border-primary"
                      : "border-secondary"
                  }`}
                >
                  <Text
                    className={`font-outfit ${
                      selectedInterests.includes(cat)
                        ? "text-white"
                        : "text-text-primary"
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <Text className="font-outfit text-text-primary mb-4">
          Tap the + to add a place to your itinerary.
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
                    ? "bg-primary border-primary"
                    : "bg-background border-primary"
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
                      ? "bg-primary"
                      : "bg-background border border-primary"
                  }`}
                >
                  <Ionicons
                    name={isSelected ? "checkmark" : "add"}
                    size={20}
                    color={isSelected ? "#ffffff" : "#F59E0B"}
                  />
                </TouchableOpacity>
                <Text className="font-outfit-bold text-lg">{place.name}</Text>
                <Text className="font-outfit text-text-primary mb-2">
                  {place.details}
                </Text>
                <Text className="font-outfit text-text-primary">
                  Ticket Price: {place.ticket_price}
                </Text>
                <Text className="font-outfit text-text-primary">
                  Time to Travel: {place.time_to_travel}
                </Text>
                <CustomButton
                  title="View on Map"
                  onPress={() =>
                    handleOpenMap(
                      `${place.name}, ${parsedTripPlan.trip_plan.location}`
                    )
                  }
                  className="mt-4"
                />
                <CustomButton
                  title="Book Tickets"
                  onPress={() =>
                    Linking.openURL(
                      generatePoiLink(
                        `${place.name} ${parsedTripPlan.trip_plan.location}`
                      )
                    )
                  }
                  className="mt-2"
                />
              </View>
            );
          })
        ) : (
          <Text className="font-outfit text-text-primary">
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
