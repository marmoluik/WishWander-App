import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import DummyLogin from "@/components/DummyLogin";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    try {
      if (!form.email || !form.password || !form.name) {
        alert("Please fill in all fields");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Successfully created user
      const user = userCredential.user;
      console.log(user);

      // Navigate to the main app
      router.replace("/(tabs)/mytrip");
    } catch (error: any) {
      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("This email is already registered");
          break;
        case "auth/invalid-email":
          alert("Invalid email address");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters");
          break;
        default:
          alert("Error creating account: " + error.message);
      }
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-72">
          <Image
            source={require("@/assets/images/avent-sign.jpg")}
            className="z-0 w-full h-72"
          />
          <Text className="text-3xl font-outfit-bold absolute bottom-0 left-5">
            Create Your Account
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title={isLoading ? "Creating Account..." : "Sign Up"}
            onPress={onSignUpPress}
            className="mt-6"
            disabled={isLoading}
          />

          <DummyLogin />
          <Link
            href="/(auth)/sign-in"
            className="text-lg text-center mt-10 font-outfit-medium"
          >
            <Text className="">Already have an account? </Text>
            <Text className="text-purple-500">Sign In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
