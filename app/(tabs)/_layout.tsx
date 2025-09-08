import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import HeaderLogo from "@/components/HeaderLogo";
import colors from "@/src/theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => <HeaderLogo />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          tabBarLabel: 'Plan',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="calendar"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          tabBarLabel: 'Nearby',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="map"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          tabBarLabel: 'Guides',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings-sharp"
              size={24}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
    </Tabs>
  );
}
