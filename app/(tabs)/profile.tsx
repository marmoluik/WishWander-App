import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/config/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { exportUserData, deleteUserData } from "@/services/userData";
import {
  getNotificationPreferences,
  setNotificationPreferences,
} from "@/packages/notify";

export default function Profile() {
  const user = auth?.currentUser;
  const [prefs, setPrefs] = useState(() => ({
    disruption: true,
    replan: true,
    booking: true,
  }));

  useEffect(() => {
    if (user?.uid) {
      setPrefs(getNotificationPreferences(user.uid));
    }
  }, [user?.uid]);

  const updatePref = (key: "replan" | "booking", value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    if (user?.uid) {
      setNotificationPreferences(user.uid, { [key]: value });
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut();
        router.replace("/(auth)/welcome");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="text-3xl font-outfit-bold mb-8">Profile</Text>

        {/* User Info Section */}
        <View className="bg-background p-6 rounded-xl mb-8 border border-primary">
          <View className="flex-row items-center mb-4">
            <View className="bg-primary p-4 rounded-full">
              <Ionicons name="person" size={32} color="#F9F5FF" />
            </View>
            <View className="ml-4">
              <Text className="text-xl font-outfit-bold text-text-primary">{user?.email}</Text>
              <Text className="text-text-primary font-outfit">
                Member since{" "}
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).getFullYear()
                  : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Settings Section */}
        <View className="mb-8">
          <Text className="text-xl font-outfit-bold mb-4">Account Settings</Text>

          <TouchableOpacity className="flex-row items-center justify-between bg-background p-4 rounded-xl mb-3">
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={24} color="#9C00FF" />
              <Text className="ml-3 font-outfit">Email</Text>
            </View>
            <Text className="text-text-primary font-outfit">{user?.email}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-background p-4 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={24} color="#9C00FF" />
              <Text className="ml-3 font-outfit">Last Sign In</Text>
            </View>
            <Text className="text-text-primary font-outfit">
              {user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification Preferences */}
        <View className="mb-8">
          <Text className="text-xl font-outfit-bold mb-4">
            Notification Preferences
          </Text>

          <View className="flex-row items-center justify-between bg-background p-4 rounded-xl mb-3">
            <View className="flex-row items-center">
              <Ionicons
                name="refresh-outline"
                size={24}
                color="#9C00FF"
              />
              <Text className="ml-3 font-outfit">Replan Suggestions</Text>
            </View>
            <Switch
              value={prefs.replan}
              onValueChange={(v) => updatePref("replan", v)}
            />
          </View>

          <View className="flex-row items-center justify-between bg-background p-4 rounded-xl mb-3">
            <View className="flex-row items-center">
              <Ionicons
                name="checkmark-done-outline"
                size={24}
                color="#9C00FF"
              />
              <Text className="ml-3 font-outfit">Booking Confirmed</Text>
            </View>
            <Switch
              value={prefs.booking}
              onValueChange={(v) => updatePref("booking", v)}
            />
          </View>

          <View className="flex-row items-center justify-between bg-background p-4 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons
                name="alert-circle-outline"
                size={24}
                color="#9C00FF"
              />
              <Text className="ml-3 font-outfit">Disruptions (always on)</Text>
            </View>
          </View>
        </View>

        {/* Data & Privacy */}
        <View className="mb-8">
          <Text className="text-xl font-outfit-bold mb-4">Data & Privacy</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between bg-background p-4 rounded-xl mb-3"
            onPress={async () => {
              const data = await exportUserData(user?.uid);
              Alert.alert("Your Data", JSON.stringify(data));
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="download-outline" size={24} color="#9C00FF" />
              <Text className="ml-3 font-outfit">Export My Data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between bg-background p-4 rounded-xl"
            onPress={async () => {
              await deleteUserData(user?.uid);
              Alert.alert("Data Deleted");
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="trash-outline" size={24} color="#9C00FF" />
              <Text className="ml-3 font-outfit">Delete My Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          bgVariant="outline"
          textVariant="primary"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
