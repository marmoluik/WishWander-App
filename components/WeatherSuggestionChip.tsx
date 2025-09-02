import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  message: string;
  onApply: () => void;
}

const WeatherSuggestionChip: React.FC<Props> = ({ message, onApply }) => (
  <TouchableOpacity
    onPress={onApply}
    className="flex-row items-center bg-secondary/20 px-3 py-1 rounded-full mt-2"
  >
    <View className="mr-2">
      <Text className="text-text-primary">{message}</Text>
    </View>
    <Text className="text-primary font-outfit-bold">Apply</Text>
  </TouchableOpacity>
);

export default WeatherSuggestionChip;
