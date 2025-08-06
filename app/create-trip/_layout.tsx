import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderLogo from "@/components/HeaderLogo";

export default function CreateTripLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "",
        headerTitle: () => <HeaderLogo />,
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerLeft: () => (
          <TouchableOpacity className="ml-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2E2A1C" />
          </TouchableOpacity>
        ),
      }}
    >
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
