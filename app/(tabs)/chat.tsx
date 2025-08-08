import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { startChatSession } from '@/config/GeminiConfig';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const sessionRef = useRef(startChatSession([]));

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    try {
      const result = await sessionRef.current.sendMessage(input);
      const text = await result.response.text();
      setMessages((prev) => [...prev, { role: 'model', text }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'model', text: 'Something went wrong.' }]);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      className={`my-1 max-w-[80%] rounded-xl px-3 py-2 ${
        item.role === 'user' ? 'self-end bg-primary' : 'self-start bg-secondary'
      }`}
    >
      <Text className={item.role === 'user' ? 'text-white' : 'text-text-primary'}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 p-4"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />
      <View className="mt-2 flex-row items-center">
        <TextInput
          className="mr-2 flex-1 rounded-full border border-primary px-4 py-2"
          placeholder="Ask something..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage} className="rounded-full bg-primary p-3">
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
