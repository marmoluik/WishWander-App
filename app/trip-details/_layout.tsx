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
<<<<<<< HEAD
            <Ionicons name="arrow-back" size={24} color="#2E2A1C" />
=======
            <Ionicons name="arrow-back" size={24} color="#000" />
>>>>>>> parent of cd4cbf6 (feat: add custom color palette)
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
