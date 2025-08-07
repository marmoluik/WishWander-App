import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length === 0) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View className="flex-row items-center p-2 border-t border-gray-200">
      <TextInput
        className="flex-1 p-2 bg-white rounded-full border border-gray-300"
        value={text}
        onChangeText={setText}
        placeholder="Ask me about your trip..."
      />
      <TouchableOpacity onPress={handleSend} className="ml-2">
        <Ionicons name="send" size={24} color="#9C00FF" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
