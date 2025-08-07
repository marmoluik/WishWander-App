import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { budgetOptions } from "@/constants/Options";
import { useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";

const SelectBudget = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const handleSelectBudget = (option: any) => {
    setTripData((prev) => {
      const newData = prev.filter((item) => !item.budget);
      return [...newData, { budget: { type: option.title } }];
    });
    // Navigate to next screen or handle selection
    router.push("/create-trip/review-trip");
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleSelectBudget(item)}
      className="flex-row items-center p-4 bg-background rounded-xl mb-4 shadow-sm border border-primary"
    >
      <View className="bg-background p-3 rounded-full">
        <Text className="text-2xl">{item.icon}</Text>
      </View>
      <View className="flex-1 ml-4">
        <Text className="text-lg font-outfit-bold">{item.title}</Text>
        <Text className="text-text-primary text-sm font-outfit">
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex justify-center mt-20">
      <View className="p-6">
        <Text className="text-5xl font-outfit-bold mb-2">
          Define your budget
        </Text>
        <Text className="text-text-primary font-outfit-medium mb-12">
          Pick a category that best fits you
        </Text>

        <FlatList
          data={budgetOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SelectBudget;
