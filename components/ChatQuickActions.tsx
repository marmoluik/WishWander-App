import React from "react";
import { View, Button } from "react-native";
import { useTranslation } from "react-i18next";

interface ChatQuickActionsProps {
  onSelect: (prompt: string) => void;
}

export default function ChatQuickActions({ onSelect }: ChatQuickActionsProps) {
  const { t } = useTranslation();
  return (
    <View className="flex-row gap-2 mt-2 flex-wrap">
      <Button title={t("quick.shift")!} onPress={() => onSelect("shift dates +2d")} />
      <Button title={t("quick.shorten")!} onPress={() => onSelect("shorten") } />
      <Button title={t("quick.budget")!} onPress={() => onSelect("budget ≤ €1200")} />
      <Button title={t("quick.gems")!} onPress={() => onSelect("add hidden gems")} />
    </View>
  );
}
