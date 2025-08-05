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
      minLength: 3,
    }
  );

  const selectAirport = async (item: any) => {
    const detail = await searchDetails(item.place_id);
    const codeMatch = item.description.match(/\(([^)]+)\)/);
    const code = codeMatch ? codeMatch[1] : "";
    setTripData((prev) => {
      const filtered = prev.filter((i) => !i.originAirport);
      return [
        ...filtered,
        {
          originAirport: {
            name: item.description,
            code,
            coordinates: detail.geometry.location,
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
          <Text style={styles.title}>Where are you flying from?</Text>
          <Text style={styles.subtitle}>Search for your departure airport</Text>
        </View>

        <View style={styles.autocomplete}>
          <TextInput
            style={styles.input}
            placeholder="Search for an airport"
            placeholderTextColor="#818181"
            returnKeyType="search"
            value={term}
            onChangeText={setTerm}
          />

          {isSearching && <Text style={styles.loading}>Loading…</Text>}

          <FlatList
            data={locationResults.filter((i) => i.description.includes("Airport"))}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row} onPress={() => selectAirport(item)}>
                <Text style={styles.rowText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !isSearching && term.length >= 3 ? (
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
  container: { flex: 1, backgroundColor: "white" },
  header: { alignItems: "center", marginTop: 20, paddingHorizontal: 16 },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666" },
  autocomplete: { flex: 1, padding: 16 },
  input: {
    height: 54,
    backgroundColor: "#e2e2e2",
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 8,
  },
  loading: { textAlign: "center", marginVertical: 8 },
  row: {
    padding: 13,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#c8c7cc",
  },
  rowText: { fontSize: 15 },
  noResults: { textAlign: "center", marginTop: 8, color: "#666" },
});

