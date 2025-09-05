import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import ChatQuickActions from "@/components/ChatQuickActions";
import { runTravelAgent } from "@/utils/chatAgent";
import { ItineraryContext } from "@/context/ItineraryContext";
import { auth, db } from "@/config/FirebaseConfig";

interface Message {
  role: "user" | "agent";
  text: string;
}

interface TripOption {
  tripId: string;
  title: string;
}

export default function ChatScreen() {
  const { itineraries } = useContext(ItineraryContext);
  const [tripId, setTripId] = useState<string | null>(null);
  const [messagesByTrip, setMessagesByTrip] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]);

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
  const messages = messagesByTrip[currentTripId] || [];

  const sendPrompt = async (prompt: string) => {
    if (!prompt) return;
    setMessagesByTrip((prev) => ({
      ...prev,
      [currentTripId]: [...messages, { role: "user", text: prompt }],
    }));
    try {
      const reply = await runTravelAgent(prompt, currentTripId);
      setMessagesByTrip((prev) => ({
        ...prev,
        [currentTripId]: [
          ...(prev[currentTripId] || []),
          { role: "agent", text: reply || "" },
        ],
      }));
    } catch (e) {
      setMessagesByTrip((prev) => ({
        ...prev,
        [currentTripId]: [
          ...(prev[currentTripId] || []),
          { role: "agent", text: "Sorry, something went wrong." },
        ],
      }));
    }
  };

  return (
    <View className="flex-1 p-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-outfit text-lg">
          {tripOptions.find((t) => t.tripId === tripId)?.title || ""}
        </Text>
        <Button title="Change Trip" onPress={() => setTripId(null)} />
      </View>
      <ScrollView className="flex-1">
        {messages.map((m, idx) => (
          <Text
            key={idx}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            {m.text}
          </Text>
        ))}
      </ScrollView>
      <ChatQuickActions onSelect={sendPrompt} />
      <View className="flex-row mt-2">
        <TextInput
          className="flex-1 border border-gray-300 p-2 mr-2"
          value={input}
          onChangeText={setInput}
        />
        <Button
          title="Send"
          onPress={() => {
            const p = input;
            setInput("");
            sendPrompt(p);
          }}
        />
      </View>
    </View>
  );
}

