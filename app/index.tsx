import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { auth } from "@/config/FirebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(auth?.currentUser ?? null);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#F59E0B" />
      </View>
    );
  }

  if (user) return <Redirect href="/(tabs)/mytrip" />;

  return <Redirect href="/(auth)/welcome" />;
}
