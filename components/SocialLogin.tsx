import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import CustomButton from './CustomButton';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import Constants from 'expo-constants';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/config/FirebaseConfig';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const SocialLogin = () => {
  const [, gResponse, promptGoogle] = Google.useAuthRequest({
    expoClientId: Constants.expoConfig?.extra?.googleExpoClientId,
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
    webClientId: Constants.expoConfig?.extra?.googleExpoClientId,
  });

  const [, fbResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.facebookAppId,
  });

  useEffect(() => {
    if (gResponse?.type === 'success') {
      const { id_token } = gResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace('/(tabs)/mytrip'))
        .catch((e) => alert('Google sign-in error: ' + e.message));
    }
  }, [gResponse]);

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .then(() => router.replace('/(tabs)/mytrip'))
        .catch((e) => alert('Facebook sign-in error: ' + e.message));
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
        title="Continue with Google"
        className="mt-5 w-full"
        bgVariant="outline"
        textVariant="primary"
        onPress={() => promptGoogle()}
      />
      <CustomButton
        title="Continue with Facebook"
        className="mt-3 w-full"
        bgVariant="outline"
        textVariant="primary"
        onPress={() => promptFacebook()}
      />
    </View>
  );
};

export default SocialLogin;
