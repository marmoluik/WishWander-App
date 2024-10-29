import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { CreateTripContext } from "@/context/CreateTripContext";

const SearchPlace = () => {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);

  return (
    <View>
      <View className="flex flex-col items-center">
        <Text className="text-3xl font-outfit-bold">Search A Place</Text>
        <Text className="text-lg text-gray-400 font-outfit">
          Find your destination!
        </Text>
      </View>

      <View className="p-6 -mt-36 h-full w-full flex justify-center">
        <GooglePlacesAutocomplete
          placeholder="Search for a place"
          textInputProps={{
            placeholderTextColor: "#818181",
            returnKeyType: "search",
            onSubmitEditing: () => {
              router.push("/create-trip/select-traveler");
            },
          }}
          fetchDetails={true}
          onPress={(data, details = null) => {
            setTripData([
              ...tripData,
              {
                locationInfo: {
                  name: data.description,
                  coordinates: details?.geometry.location,
                  //   photoRef: details?.photos?.[0]?.photo_reference,
                  url: details?.url,
                },
              },
            ]);
            router.push("/create-trip/select-traveler");
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
            language: "en",
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              height: 54,
              backgroundColor: "#e2e2e2",
              borderRadius: 999,
              paddingHorizontal: 16,
              fontSize: 15,
              fontFamily: "outfit-medium",
            },
            listView: {
              backgroundColor: "#fff",
              borderRadius: 8,
              marginTop: 8,
            },
            row: {
              padding: 13,
              height: 50,
              flexDirection: "row",
            },
            separator: {
              height: 0.5,
              backgroundColor: "#c8c7cc",
            },
            description: {
              fontSize: 15,
              fontFamily: "outfit",
            },
            predefinedPlacesDescription: {
              color: "#666666",
            },
            textInputContainer: {
              color: "#b5b3b3",
            },
          }}
        />
      </View>
    </View>
  );
};

export default SearchPlace;
