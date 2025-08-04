import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text } from "react-native";

type Prediction = {
  place_id: string;
  description: string;
};

type Props = {
  onPlaceSelected: (place: { id: string; title: string }) => void;
};

const YOUR_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY;

export default function GooglePlacesAutocomplete({ onPlaceSelected }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Prediction[]>([]); // always an array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${YOUR_KEY}&input=${query}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setResults(json.predictions ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  function buildRowsFromResults() {
    return (results ?? [])
      .filter((item) =>
        item.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((item) => ({
        id: item.place_id,
        title: item.description,
      }));
  }

  const rows = buildRowsFromResults();

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search places…"
      />
      {loading && <Text>Loading…</Text>}
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPlaceSelected(item)}>
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

