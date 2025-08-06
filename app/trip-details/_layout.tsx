import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HeaderLogo from "@/components/HeaderLogo";

export default function TripDetailsLayout() {
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
            <Ionicons name="arrow-back" size={24} color="#1F2D3D" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
