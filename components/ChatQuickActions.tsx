import React from "react";
import { View, Button } from "react-native";

interface ChatQuickActionsProps {
  onSelect: (prompt: string) => void;
}

export default function ChatQuickActions({ onSelect }: ChatQuickActionsProps) {
  return (
    <View className="flex-row gap-2 mt-2">
      <Button
        title="Add dinner at 19:00 within 1km"
        onPress={() => onSelect("Add dinner at 19:00 within 1km")}
      />
      <Button
        title="Find late-night dessert"
        onPress={() => onSelect("Find late-night dessert")}
      />
    </View>
  );
}
