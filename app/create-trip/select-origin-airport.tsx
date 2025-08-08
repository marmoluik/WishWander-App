// app/create-trip/select-origin-airport.tsx

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
import { getNearestAirport } from "@/utils/getNearestAirport";

export default function SelectOriginAirport() {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);
  const isWeb = Platform.OS === "web";
  const Wrapper: any = isWeb ? View : TouchableWithoutFeedback;

  return (
    <Wrapper {...(!isWeb ? { onPress: Keyboard.dismiss } : {})}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Which airport are you flying from?</Text>
          <Text style={styles.subtitle}>
            Enter the name or code of your departure airport (no cities or
            countries)
          </Text>
        </View>

        <View style={styles.autocomplete}>
          <GooglePlacesAutocomplete
            placeholder="Search airport name or code"
            fetchDetails={true}
            onPress={async (data, details = null) => {
              if (!details) return;

              let name = data.description;
              let code = "";
              let coordinates = details.geometry.location;

              if (data.types?.includes("airport")) {
                const codeMatch = data.description.match(/\(([^)]+)\)/);
                code = codeMatch ? codeMatch[1] : "";
              } else {
                try {
                  const res = await fetch(
                    `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(
                      data.description
                    )}&locale=en&types[]=airport&limit=1`
                  );
                  const json = await res.json();
                  const airport = json?.[0];
                  if (airport) {
                    name = `${airport.name} (${airport.code})`;
                    code = airport.code;
                    coordinates = {
                      lat: airport.coordinates?.lat,
                      lng: airport.coordinates?.lon,
                    };
                  }
                } catch (e) {
                  console.error("airport lookup failed", e);
                }

                if (!code || !coordinates) {
                  const nearest = getNearestAirport(
                    details.geometry.location.lat,
                    details.geometry.location.lng
                  );
                  if (nearest) {
                    name = `${nearest.name} (${nearest.code})`;
                    code = nearest.code;
                    coordinates = {
                      lat: nearest.lat,
                      lng: nearest.lng,
                    };
                  }
                }
              }

              if (!code || !coordinates) return;

              setTripData((prev) => {
                const filtered = prev.filter((i) => !i.originAirport);
                return [
                  ...filtered,
                  {
                    originAirport: {
                      name,
                      code,
                      coordinates,
                    },
                  },
                ];
              });

              router.push("/create-trip/select-traveler");
            }}
            query={{
              key: Constants.expoConfig?.extra?.googlePlacesApiKey!,
              language: "en",
              types: "establishment",
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
