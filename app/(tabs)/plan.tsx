import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function Plan() {
  return (
    <ScrollView className="flex-1 bg-surface p-4">
      <Text className="text-heading text-textPrimary font-bold mb-4">Upcoming Trip</Text>
      <View className="bg-cardBg rounded-lg shadow-md p-4 mb-4">
        <Text className="text-textSecondary">No trips yet</Text>
      </View>
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
          <Text className="text-cardBg text-body">Add activity</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-accent px-4 py-2 rounded-lg">
          <Text className="text-cardBg text-body">Replan</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
          <Text className="text-cardBg text-body">Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
