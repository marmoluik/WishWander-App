import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function Guides() {
  return (
    <ScrollView className="flex-1 bg-surface p-4">
      <Text className="text-heading text-textPrimary font-bold mb-4">Local Guides</Text>
      <View className="bg-cardBg rounded-lg shadow-md p-4 mb-4">
        <Text className="text-textSecondary">No tips yet</Text>
      </View>
    </ScrollView>
  );
}
