import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/config/FirebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { UserPreferencesContext } from "@/context/UserPreferencesContext";

export default function Profile() {
  const user = auth?.currentUser;
  const { preferences, setPreferences } = useContext(UserPreferencesContext);
  const [form, setForm] = useState({
    budget: preferences.budget ? String(preferences.budget) : "",
    preferredAirlines: preferences.preferredAirlines.join(", "),
    preferredHotels: preferences.preferredHotels.join(", "),
    dietaryNeeds: preferences.dietaryNeeds.join(", "),
    petFriendly: preferences.petFriendly || false,
  });

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
    <SafeAreaView className="flex-1 bg-background p-6">
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

      {/* Preferences Section */}
      <View className="mb-8">
        <Text className="text-xl font-outfit-bold mb-4">Preferences</Text>
        <TextInput
          className="bg-background p-4 rounded-xl mb-3 border border-primary"
          placeholder="Budget (USD)"
          keyboardType="numeric"
          value={form.budget}
          onChangeText={(v) => setForm({ ...form, budget: v })}
        />
        <TextInput
          className="bg-background p-4 rounded-xl mb-3 border border-primary"
          placeholder="Preferred Airlines (comma separated)"
          value={form.preferredAirlines}
          onChangeText={(v) => setForm({ ...form, preferredAirlines: v })}
        />
        <TextInput
          className="bg-background p-4 rounded-xl mb-3 border border-primary"
          placeholder="Preferred Hotels (comma separated)"
          value={form.preferredHotels}
          onChangeText={(v) => setForm({ ...form, preferredHotels: v })}
        />
        <TextInput
          className="bg-background p-4 rounded-xl mb-3 border border-primary"
          placeholder="Dietary Needs (comma separated)"
          value={form.dietaryNeeds}
          onChangeText={(v) => setForm({ ...form, dietaryNeeds: v })}
        />
        <View className="flex-row items-center mb-4">
          <Text className="font-outfit mr-3">Pet Friendly</Text>
          <Switch
            value={form.petFriendly}
            onValueChange={(v) => setForm({ ...form, petFriendly: v })}
          />
        </View>
        <CustomButton
          title="Save Preferences"
          onPress={() =>
            setPreferences({
              budget: form.budget ? Number(form.budget) : undefined,
              preferredAirlines: form.preferredAirlines
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              preferredHotels: form.preferredHotels
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              dietaryNeeds: form.dietaryNeeds
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              petFriendly: form.petFriendly,
            })
          }
        />
      </View>

      {/* Logout Button */}
      <CustomButton
        title="Logout"
        onPress={handleLogout}
        bgVariant="outline"
        textVariant="primary"
      />
    </SafeAreaView>
  );
}
