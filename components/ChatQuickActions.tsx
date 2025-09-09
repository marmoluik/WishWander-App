import React from "react";
import { View, Button } from "react-native";
import i18n from "../src/i18n";

interface ChatQuickActionsProps {
  onSelect: (prompt: string) => void;
}

export default function ChatQuickActions({ onSelect }: ChatQuickActionsProps) {
  return (
    <View className="flex-row gap-2 mt-2 flex-wrap">
      <Button
        title={i18n.t("quick.shift")}
        onPress={() => onSelect("shift dates +2d")}
      />
      <Button
        title={i18n.t("quick.shorten")}
        onPress={() => onSelect("shorten")}
      />
      <Button
        title={i18n.t("quick.budget")}
        onPress={() => onSelect("budget ≤ €1200")}
      />
      <Button
        title={i18n.t("quick.gems")}
        onPress={() => onSelect("add hidden gems")}
      />
    </View>
  );
}
