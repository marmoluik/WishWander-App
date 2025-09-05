import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Linking, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "@/components/CustomButton";
import { hotelProvider } from "@/packages/providers/registry";
import { recordAffiliateClick } from "@/services/affiliate";
import type { HotelOffer } from "@/packages/providers/types";
import { useCurrency } from "@/context/CurrencyContext";

export default function HotelList() {
  const { query } = useLocalSearchParams<{ query?: string }>();
  const router = useRouter();
  const { format } = useCurrency();
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
      <TouchableOpacity className="mb-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
      </TouchableOpacity>
      <Text className="text-2xl font-outfit-bold mb-4">
        Hotels in {String(query || "")}
      </Text>
      {results.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="font-outfit text-text-primary mb-4">
            No hotels found.
          </Text>
          <CustomButton title="Go Back" onPress={() => router.back()} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View className="p-4 mb-4 bg-background rounded-xl border border-primary">
              <Text className="font-outfit-bold">{item.name}</Text>
              <Text className="font-outfit text-text-primary">
                {format(Number(item.price))}
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
      )}
    </SafeAreaView>
  );
}

