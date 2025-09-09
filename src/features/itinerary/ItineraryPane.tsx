import React from 'react';
import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { PlaceResult } from '../../services/tools';

interface ItineraryPaneProps {
  places: PlaceResult[];
}

export default function ItineraryPane({ places }: ItineraryPaneProps) {
  return (
    <View className="w-full md:w-1/3 border-l border-gray-200 p-2" testID="itinerary-pane">
      <ScrollView>
        {places.map((p) => (
          <TouchableOpacity key={p.id} onPress={() => p.url && Linking.openURL(p.url)} className="mb-4">
            {p.url && (
              <Image source={{ uri: p.url }} className="w-full h-32 mb-2" />
            )}
            <Text className="font-outfit">{p.title}</Text>
            {p.price != null && <Text className="text-sm">€{p.price}</Text>}
          </TouchableOpacity>
        ))}
        {places.length === 0 && (
          <Text className="font-outfit text-center">No itinerary yet</Text>
        )}
      </ScrollView>
    </View>
  );
}
