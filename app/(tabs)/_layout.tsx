import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontFamily: "outfit-medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="mytrip"
        options={{
          tabBarLabel: "My Trip",
          tabBarIcon: () => (
            <Ionicons name="location-sharp" size={24} color="#8b5cf6" />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: () => (
            <MaterialIcons name="travel-explore" size={24} color="#8b5cf6" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <FontAwesome name="user-o" size={21} color="#8b5cf6" />
          ),
        }}
      />
    </Tabs>
  );
}
