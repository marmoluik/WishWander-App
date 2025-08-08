// app/create-trip/_layout.tsx

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderLogo from "@/components/HeaderLogo";

export default function CreateTripLayout() {
  const router = useRouter();
  return (
    <Stack screenOptions={{
      headerShown: true,
      headerBackTitle: "",
      headerTitle: () => <HeaderLogo />,
      headerStyle: { backgroundColor: "transparent" },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
        </TouchableOpacity>
      ),
    }}>
      <Stack.Screen name="search-place" />
      <Stack.Screen name="select-origin-airport" />
      <Stack.Screen name="select-traveler" />
      <Stack.Screen name="select-dates" />
      <Stack.Screen name="flexible-dates" />
      <Stack.Screen name="select-budget" />
      <Stack.Screen name="review-trip" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: { marginLeft: 16, padding: 8 },
});
