import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Prediction = {
  place_id: string;
  description: string;
};

type Props = {
  onPlaceSelected: (place: { id: string; title: string }) => void;
};

const YOUR_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GooglePlacesAutocomplete({ onPlaceSelected }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]); // always an array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${YOUR_KEY}&input=${encodeURIComponent(
        query,
      )}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setResults(
            Array.isArray(json.predictions) ? json.predictions : [],
          );
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

  const rows = useMemo(
    () =>
      (results ?? [])
        .filter((item) =>
          item.description.toLowerCase().includes(query.toLowerCase()),
        )
        .map((item) => ({
          id: item.place_id,
          title: item.description,
        })),
    [results, query],
  );
  function buildRowsFromResults() {
    return (results ?? [])
      .filter((item: Prediction) =>
        item.description.toLowerCase().includes(query.toLowerCase()),
      )
      .map((item: Prediction) => ({
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

