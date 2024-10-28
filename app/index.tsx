import { Redirect } from "expo-router";
import { View, Text, StatusBar } from "react-native";

export default function HomeScreen() {
  return <Redirect href="/(auth)/welcome" />;
}
