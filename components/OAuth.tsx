import { View, Text, Image } from "react-native";
import React, { useEffect } from "react";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { auth } from "@/config/FirebaseConfig";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const OAuth = () => {
  const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
  });

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || "",
  });

  useEffect(() => {
    if (gResponse?.type === "success") {
      const idToken = gResponse.authentication?.idToken;
      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(auth, credential).catch(console.error);
      }
    }
  }, [gResponse]);

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const accessToken = fbResponse.authentication?.accessToken;
      if (accessToken) {
        const credential = FacebookAuthProvider.credential(accessToken);
        signInWithCredential(auth, credential).catch(console.error);
      }
    }
  }, [fbResponse]);

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-primary" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-primary" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={() => gPromptAsync()}
        disabled={!gRequest}
      />

      <CustomButton
        title="Log In with Facebook"
        className="mt-3 w-full shadow-none"
        IconLeft={() => (
          <Ionicons
            name="logo-facebook"
            size={20}
            color="#1877F2"
            style={{ marginHorizontal: 8 }}
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={() => fbPromptAsync()}
        disabled={!fbRequest}
      />
    </View>
  );
};

export default OAuth;
