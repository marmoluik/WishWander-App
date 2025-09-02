import React, { useState } from "react";
import { View, TextInput, Button, ScrollView, Text } from "react-native";
import ChatQuickActions from "@/components/ChatQuickActions";
import { runTravelAgent } from "@/utils/chatAgent";

interface Message {
  role: "user" | "agent";
  text: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendPrompt = async (prompt: string) => {
    if (!prompt) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    const reply = await runTravelAgent(prompt);
    setMessages((m) => [...m, { role: "agent", text: reply }]);
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
