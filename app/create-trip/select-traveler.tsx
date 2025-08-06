import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { travelerOptions } from "@/constants/Options";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { CreateTripContext } from "@/context/CreateTripContext";
import { useRouter } from "expo-router";

const SelectTraveler = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const handleSelectTraveler = (option: any) => {
    setTripData((prev) => {
      const newData = prev.filter((item) => !item.travelers);
      return [
        ...newData,
        {
          travelers: {
            type: option.title,
            count: option.people,
          },
        },
      ];
    });
    router.push("/create-trip/select-dates");
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleSelectTraveler(item)}
      className="flex-row items-center p-4 bg-background rounded-xl mb-4 shadow-sm border border-primary"
    >
      <View className="bg-secondary p-3 rounded-full">
        {item.icon === "person" || item.icon === "people-circle" ? (
          <Ionicons name={item.icon as any} size={24} color="#F59E0B" />
        ) : (
          <MaterialIcons name={item.icon as any} size={24} color="#F59E0B" />
        )}
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-lg font-outfit-bold">{item.title}</Text>
        <Text className="text-text-primary text-sm font-outfit">
          {item.description}
        </Text>
      </View>
      <View className="bg-primary px-3 py-1 rounded-full">
        <Text className="text-white font-outfit-medium">{item.people}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="p-6">
        <Text className="text-5xl font-outfit-bold mb-2">{"Who's Travelling?"}</Text>
        <Text className="text-text-primary font-outfit-medium mb-6">
          Choose your travelers
        </Text>

        <FlatList
          data={travelerOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectTraveler;
