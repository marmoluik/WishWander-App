import React from 'react';
import { View, Text } from 'react-native';
import { ChatMessage } from '@/types/Chat';

interface Props {
  message: ChatMessage;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <View className={`my-1 p-3 rounded-xl max-w-[80%] ${isUser ? 'self-end bg-primary' : 'self-start bg-background'}`}>
      <Text className={isUser ? 'text-white' : 'text-text-primary'}>{message.content}</Text>
    </View>
  );
};

export default MessageBubble;
