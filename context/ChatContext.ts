import React, { createContext, useContext, useState } from 'react';
import { ChatMessage } from '@/types/Chat';

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = async (content: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    try {
      const agent = await import('@/services/AutonomousAgent');
      const response = await agent.default.handleMessage(content);
      const agentMsg: ChatMessage = {
        id: Date.now().toString() + '-agent',
        role: 'agent',
        content: response,
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (e) {
      console.error('chat send failed', e);
    }
  };

  return React.createElement(
    ChatContext.Provider,
    { value: { messages, sendMessage } },
    children
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return ctx;
};
