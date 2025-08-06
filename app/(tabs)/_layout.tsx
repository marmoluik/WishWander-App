import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import HeaderLogo from "@/components/HeaderLogo";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderLogo />,
<<<<<<< HEAD
        tabBarActiveTintColor: "#F4C430",
        tabBarInactiveTintColor: "#2E2A1C",
=======
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#64748b",
>>>>>>> parent of cd4cbf6 (feat: add custom color palette)
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
<<<<<<< HEAD
              color={focused ? "#F4C430" : "#2E2A1C"}
=======
              color={focused ? "#8b5cf6" : "#64748b"}
>>>>>>> parent of cd4cbf6 (feat: add custom color palette)
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
<<<<<<< HEAD
              color={focused ? "#F4C430" : "#2E2A1C"}
=======
              color={focused ? "#8b5cf6" : "#64748b"}
>>>>>>> parent of cd4cbf6 (feat: add custom color palette)
            />
          ),
        }}
      />
      <Tabs.Screen
        name="itineraries"
        options={{
          tabBarLabel: "Itineraries",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="calendar"
              size={24}
<<<<<<< HEAD
              color={focused ? "#F4C430" : "#2E2A1C"}
=======
              color={focused ? "#8b5cf6" : "#64748b"}
>>>>>>> parent of cd4cbf6 (feat: add custom color palette)
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
<<<<<<< HEAD
              color={focused ? "#F4C430" : "#2E2A1C"}
=======
              color={focused ? "#8b5cf6" : "#64748b"}
>>>>>>> parent of cd4cbf6 (feat: add custom color palette)
            />
          ),
        }}
      />
    </Tabs>
  );
}
