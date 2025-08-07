import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import SocialLogin from "@/components/SocialLogin";

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPress = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Please fill in all fields");
        return;
      }

      if (!auth) {
        alert("Firebase not initialized");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Successfully signed in
      const user = userCredential.user;
      console.log(user);

      // Navigate to the main app
      router.replace("/(tabs)/mytrip");
    } catch (error: any) {
      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid email address");
          break;
        case "auth/user-disabled":
          alert("This account has been disabled");
          break;
        case "auth/user-not-found":
          alert("No account found with this email");
          break;
        case "auth/wrong-password":
          alert("Incorrect password");
          break;
        default:
          alert("Error signing in: " + error.message);
      }
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <View className="relative w-full h-72">
          <Image
            source={require("@/assets/images/wishwander-sign.jpg")}
            className="z-0 w-full h-72"
          />
          <Text className="text-3xl font-outfit-bold absolute bottom-0 left-5">
            Welcome Back, Log In!
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email address"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter a good password"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title={isLoading ? "Logging In..." : "Log In"}
            onPress={onLoginPress}
            className="mt-6"
            disabled={isLoading}
          />

          <SocialLogin />

          <Link
            href="/(auth)/sign-up"
            className="text-lg text-center mt-10 font-outfit-medium"
          >
            <Text className="">New to WishWander? </Text>
            <Text className="text-primary">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
