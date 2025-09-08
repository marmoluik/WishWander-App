import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <ImageBackground
      source={require('@/assets/images/wishwander-sign.jpg')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-black/40 items-center justify-center p-4">
        <Text className="text-heading text-cardBg font-bold mb-6 text-center">
          Your AI travel companion
        </Text>
        <Link href="/(tabs)/plan" asChild>
          <TouchableOpacity className="bg-primary px-6 py-3 rounded-full mb-4">
            <Text className="text-cardBg text-subtitle">Start Planning</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)/nearby" asChild>
          <TouchableOpacity className="bg-accent px-6 py-3 rounded-full">
            <Text className="text-cardBg text-subtitle">Explore Nearby</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
}
