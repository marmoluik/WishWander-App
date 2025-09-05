import React, { useContext, useState } from "react";
import { View, TextInput, Button, ScrollView, Text } from "react-native";
import ChatQuickActions from "@/components/ChatQuickActions";
import { runTravelAgent } from "@/utils/chatAgent";
import { CreateTripContext } from "@/context/CreateTripContext";

interface Message {
  role: "user" | "agent";
  text: string;
}

export default function ChatScreen() {
  const { tripData } = useContext(CreateTripContext);
  const location = tripData.find((t: any) => t.locationInfo)?.locationInfo;
  const tripId = `${location?.name || "trip"}`;
  const [messagesByTrip, setMessagesByTrip] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");

  const messages = messagesByTrip[tripId] || [];

  const sendPrompt = async (prompt: string) => {
    if (!prompt) return;
    setMessagesByTrip((prev) => ({
      ...prev,
      [tripId]: [...messages, { role: "user", text: prompt }],
    }));
    const reply = await runTravelAgent(prompt);
    setMessagesByTrip((prev) => ({
      ...prev,
      [tripId]: [...(prev[tripId] || []), { role: "agent", text: reply }],
    }));
  };

  return (
    <View className="flex-1 p-4">
      <ScrollView className="flex-1">
        {messages.map((m, idx) => (
          <Text key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
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
