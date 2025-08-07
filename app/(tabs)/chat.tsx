import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// eslint-disable-next-line import/namespace
import { ChatProvider, useChat } from '@/context/ChatContext';
import MessageBubble from '@/components/Chat/MessageBubble';
import ChatInput from '@/components/Chat/ChatInput';

const ChatScreenContent = () => {
  const { messages, sendMessage } = useChat();
  return (
    <SafeAreaView className="flex-1">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
      <ChatInput onSend={sendMessage} />
    </SafeAreaView>
  );
};

const ChatScreen = () => (
  <ChatProvider>
    <ChatScreenContent />
  </ChatProvider>
);

export default ChatScreen;
