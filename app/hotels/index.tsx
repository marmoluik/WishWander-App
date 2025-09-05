import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { hotelProvider } from "@/packages/providers/registry";
import { recordAffiliateClick } from "@/services/affiliate";
import type { HotelOffer } from "@/packages/providers/types";

export default function HotelList() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const [results, setResults] = useState<HotelOffer[]>([]);

  useEffect(() => {
    if (query) {
      hotelProvider
        .search({ query: String(query) })
        .then((res) => setResults(res))
        .catch(() => setResults([]));
    }
  }, [query]);

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-outfit-bold mb-4">
        Hotels in {String(query || "")}
      </Text>
      <FlatList
        data={results}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View className="p-4 mb-4 bg-background rounded-xl border border-primary">
            <Text className="font-outfit-bold">{item.name}</Text>
            <Text className="font-outfit text-text-primary">
              ${item.price}
            </Text>
            {item.bookingUrl?.startsWith("http") && (
              <CustomButton
                title="Book"
                onPress={() => {
                  recordAffiliateClick("hotel");
                  Linking.openURL(item.bookingUrl);
                }}
                className="mt-2"
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

