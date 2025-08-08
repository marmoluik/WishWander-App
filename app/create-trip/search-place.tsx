// app/create-trip/search-place.tsx

import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { CreateTripContext } from "@/context/CreateTripContext";

export default function SearchPlace() {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);
  const isWeb = Platform.OS === "web";
  const Wrapper: any = isWeb ? View : TouchableWithoutFeedback;

  return (
    <Wrapper {...(!isWeb ? { onPress: Keyboard.dismiss } : {})}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Where do you want to go?</Text>
          <Text style={styles.subtitle}>Find your destination!</Text>
        </View>

        <View style={styles.autocomplete}>
          <GooglePlacesAutocomplete
            placeholder="Search for a place"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (!details) return;

              setTripData((prev) => {
                const filtered = prev.filter((i) => !i.locationInfo);
                return [
                  ...filtered,
                  {
                    locationInfo: {
                      name: data.description,
                      coordinates: details.geometry.location,
                      url: details.url,
                      photoRef: details.photos?.[0]?.photo_reference,
                    },
                  },
                ];
              });

              router.push("/create-trip/select-origin-airport");
            }}
            query={{
              key: Constants.expoConfig?.extra?.googlePlacesApiKey!,
              language: "en",
              types: "geocode",
            }}
            styles={{
              textInput: styles.input,
              listView: { backgroundColor: "#F9F5FF" },
              row: styles.row,
              separator: {
                height: 0.5,
                backgroundColor: "#9C00FF",
              },
              description: styles.rowText,
            }}
            debounce={300}
            minLength={2}
            enablePoweredByContainer={false}
          />
        </View>
      </SafeAreaView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F5FF" },
  header: { alignItems: "center", marginTop: 20, paddingHorizontal: 16 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#1E1B4B" },
  autocomplete: { flex: 1, padding: 16 },
  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#9C00FF",
  },
  row: {
    padding: 13,
    backgroundColor: "#F9F5FF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#9C00FF",
  },
  rowText: { fontSize: 15 },
});
