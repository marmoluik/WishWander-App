// app/create-trip/select-origin-airport.tsx

import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useGoogleAutocomplete } from "@appandflow/react-native-google-autocomplete";
import Constants from "expo-constants";
import { CreateTripContext } from "@/context/CreateTripContext";
import { getNearestAirport } from "@/utils/getNearestAirport";

export default function SelectOriginAirport() {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const {
    locationResults,
    isSearching,
    term,
    setTerm,
    searchDetails,
  } = useGoogleAutocomplete(
    Constants.expoConfig?.extra?.googlePlacesApiKey!,
    {
      debounce: 300,
      minLength: 2,
      // Restrict results to airport establishments only
      queryTypes: "establishment",
    }
  );

  const selectAirport = async (item: any) => {
    let name = item.description;
    let code = "";
    let coordinates: { lat: number; lng: number } | undefined;

    if (item.types?.includes("airport")) {
      const detail = await searchDetails(item.place_id);
      const codeMatch = item.description.match(/\(([^)]+)\)/);
      code = codeMatch ? codeMatch[1] : "";
      coordinates = detail.geometry.location;
    } else {
      const detail = await searchDetails(item.place_id);
      const { lat, lng } = detail.geometry.location;
      try {
        const res = await fetch(
          `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(
            item.description
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
      // Fallback to local dataset when API isn't available
      if (!code || !coordinates) {
        const nearest = getNearestAirport(lat, lng);
        if (nearest) {
          name = `${nearest.name} (${nearest.code})`;
          code = nearest.code;
          coordinates = { lat: nearest.lat, lng: nearest.lng };
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
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Which airport are you flying from?</Text>
          <Text style={styles.subtitle}>
            Enter the name or code of your departure airport (no cities or
            countries)
          </Text>
        </View>

        <View style={styles.autocomplete}>
          <TextInput
            style={styles.input}
            placeholder="Search airport name or code"
            placeholderTextColor="#1E1B4B"
            returnKeyType="search"
            value={term}
            onChangeText={setTerm}
          />

          {isSearching && <Text style={styles.loading}>Loading…</Text>}

          <FlatList
            data={locationResults.filter((i) => i.types?.includes("airport"))}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onPress={() => selectAirport(item)}>
                <Text style={styles.rowText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !isSearching && term.length >= 2 ? (
                <Text style={styles.noResults}>No results</Text>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F5FF" },
  header: { alignItems: "center", marginTop: 20, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#1E1B4B" },
  autocomplete: { flex: 1, padding: 16 },
  input: {
    height: 54,
    backgroundColor: "#F9F5FF",
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 8,
  },
  loading: { textAlign: "center", marginVertical: 8 },
  row: {
    padding: 13,
    backgroundColor: "#F9F5FF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#9C00FF",
  },
  rowText: { fontSize: 15 },
  noResults: { textAlign: "center", marginTop: 8, color: "#1E1B4B" },
});

