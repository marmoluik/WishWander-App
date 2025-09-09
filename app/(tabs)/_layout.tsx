import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeaderLogo from "@/components/HeaderLogo";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderLogo />,
        tabBarActiveTintColor: "#9C00FF",
        tabBarInactiveTintColor: "#1E1B4B",
        tabBarLabelStyle: {
          fontFamily: "outfit-medium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="mytrip"
        options={{
          tabBarLabel: "My Trips",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="location-sharp"
              size={24}
              color={focused ? "#9C00FF" : "#1E1B4B"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="travel-explore"
              size={24}
              color={focused ? "#9C00FF" : "#1E1B4B"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="itineraries"
        options={{
          headerShown: false,
          tabBarLabel: "Itineraries",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="calendar"
              size={24}
              color={focused ? "#9C00FF" : "#1E1B4B"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubbles"
              size={24}
              color={focused ? "#9C00FF" : "#1E1B4B"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings-sharp"
              size={24}
              color={focused ? "#9C00FF" : "#1E1B4B"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user-o"
              size={21}
              color={focused ? "#9C00FF" : "#1E1B4B"}
            />
          ),
        }}
      />
      {/* Additional screens are handled outside the tab navigator */}
    </Tabs>
  );
}
