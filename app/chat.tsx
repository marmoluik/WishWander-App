import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Switch,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import ChatQuickActions from "@/components/ChatQuickActions";
import { useChat } from "@/context/ChatContext";
import { ItineraryContext } from "@/context/ItineraryContext";
import { auth, db } from "@/config/FirebaseConfig";
import ItineraryPane from "@/src/features/itinerary/ItineraryPane";
import { PlaceResult } from "@/src/services/tools";
import { parseIntent } from "@/src/services/intent";
import { Message } from "@/src/state/chatStore";

interface TripOption {
  tripId: string;
  title: string;
}

export default function ChatScreen() {
  const { itineraries } = useContext(ItineraryContext);
  const { threads, sendMessage } = useChat();
  const [tripMode, setTripMode] = useState(true);
  const [tripId, setTripId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]);
  const [places, setPlaces] = useState<PlaceResult[]>([]);

  // merge itineraries into trip options
  useEffect(() => {
    setTripOptions((prev) => {
      const map = new Map(prev.map((t) => [t.tripId, t]));
      itineraries.forEach((it) => {
        map.set(it.tripId, { tripId: it.tripId, title: it.title });
      });
      return Array.from(map.values());
    });
  }, [itineraries]);

  // fetch trips from Firestore so chat works even without itineraries
  useEffect(() => {
    const fetchTrips = async () => {
      const user = auth?.currentUser;
      if (!db || !user) return;
      const tripCollection = collection(db, "UserTrips", user.uid, "trips");
      const snapshot = await getDocs(tripCollection);
      setTripOptions((prev) => {
        const map = new Map(prev.map((t) => [t.tripId, t]));
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          const title = data.tripPlan?.trip_plan?.location || "Trip";
          map.set(docSnap.id, { tripId: docSnap.id, title });
        });
        return Array.from(map.values());
      });
    };
    fetchTrips();
  }, []);

  if (!tripId) {
    return (
      <View className="flex-1 p-4">
        <ScrollView>
          {tripOptions.map((t) => (
            <TouchableOpacity
              key={t.tripId}
              className="p-4 mb-3 bg-background rounded-xl border border-primary"
              onPress={() => setTripId(t.tripId)}
            >
              <Text className="font-outfit">{t.title}</Text>
            </TouchableOpacity>
          ))}
          {tripOptions.length === 0 && (
            <Text className="font-outfit text-text-primary">No trips available.</Text>
          )}
        </ScrollView>
      </View>
    );
  }

  const currentTripId = tripId as string;
  const messages = threads[currentTripId]?.messages || [];

  const sendPrompt = async (prompt: string) => {
    if (!prompt) return;
    await sendMessage(prompt, currentTripId);
    const intent = parseIntent(prompt);
    if (intent?.type === 'replaceActivity') {
      setPlaces((prev) => prev.filter((p, idx) => idx !== intent.day - 1));
    }
  };

  return (
    <View className="flex-1 flex-row">
      <View className="flex-1 p-4">
        <View className="flex-row justify-between mb-2">
          <View className="flex-row items-center">
            <Text className="font-outfit text-lg">
              {tripOptions.find((t) => t.tripId === tripId)?.title || ""}
            </Text>
            <Switch className="ml-2" value={tripMode} onValueChange={setTripMode} />
          </View>
          <Button title="Change Trip" onPress={() => setTripId(null)} />
        </View>
        <ScrollView className="flex-1">
          {messages.map((m: Message) => (
            <Text
              key={m.id}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              {m.content}
              {m.partial && " …"}
            </Text>
          ))}
        </ScrollView>
        <ChatQuickActions onSelect={sendPrompt} />
        <View className="flex-row mt-2">
          <TextInput
            className="flex-1 border border-gray-300 p-2 mr-2"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Button
            title="Send"
            onPress={() => {
              const p = input;
              setInput("");
              sendPrompt(p);
            }}
            disabled={!input}
          />
        </View>
      </View>
      <ItineraryPane places={places} />
    </View>
  );
}
