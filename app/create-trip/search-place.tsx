// app/create-trip/search-place.tsx

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
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useGoogleAutocomplete } from "@appandflow/react-native-google-autocomplete";
import Constants from "expo-constants";
import { CreateTripContext } from "@/context/CreateTripContext";

export default function SearchPlace() {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  const isWeb = Platform.OS === "web";

  // Initialize the hook with your API key and options
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
      // Allow searching for both cities and countries
      queryTypes: "geocode",
      ...(isWeb && { proxyUrl: "https://cors.isomorphic-git.org/" }),
    }
  );

  // Fetch details when a place is selected
  const selectPlace = async (item: any) => {
    const detail: any = await searchDetails(item.place_id);
    setTripData((prev) => {
      const filtered = prev.filter((i) => !i.locationInfo);
      return [
        ...filtered,
        {
          locationInfo: {
            name: item.description,
            coordinates: detail.geometry.location,
            url: detail.url,
            photoRef: detail.photos?.[0]?.photo_reference,
          },
        },
      ];
    });
    router.push("/create-trip/select-origin-airport");
  };

  const Wrapper: any = isWeb ? View : TouchableWithoutFeedback;

  return (
    <Wrapper {...(!isWeb ? { onPress: Keyboard.dismiss } : {})}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Where do you want to go?</Text>
          <Text style={styles.subtitle}>Find your destination!</Text>
        </View>

        <View style={styles.autocomplete}>
          <TextInput
            style={styles.input}
            placeholder="Search for a place"
            placeholderTextColor="#1E1B4B"
            returnKeyType="search"
            value={term}
            onChangeText={setTerm}
          />

          {isSearching && <Text style={styles.loading}>Loading…</Text>}

          <FlatList
            data={locationResults}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => selectPlace(item)}
              >
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
    </Wrapper>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#9C00FF",
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
