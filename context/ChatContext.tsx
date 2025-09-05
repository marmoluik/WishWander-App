import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import ChatService from '@/services/chatService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tripId?: string;
}

interface ChatContextValue {
  messagesByTrip: Record<string, ChatMessage[]>;
  sendMessage: (prompt: string, tripId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messagesByTrip, setMessagesByTrip] = useState<Record<string, ChatMessage[]>>({});
  const serviceRef = useRef<ChatService | null>(null);

  if (!serviceRef.current) {
    serviceRef.current = new ChatService();
  }

  const appendMessage = (tripId: string, message: ChatMessage) => {
    setMessagesByTrip(prev => ({
      ...prev,
      [tripId]: [...(prev[tripId] || []), message],
    }));
  };

  const updateLastAssistantMessage = (tripId: string, updater: (msg: ChatMessage) => ChatMessage) => {
    setMessagesByTrip(prev => {
      const arr = [...(prev[tripId] || [])];
      const lastIndex = arr.length - 1;
      if (lastIndex >= 0) {
        arr[lastIndex] = updater(arr[lastIndex]);
      }
      return { ...prev, [tripId]: arr };
    });
  };

  const sendMessage = async (prompt: string, tripId: string) => {
    const service = serviceRef.current!;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt, tripId };
    appendMessage(tripId, userMsg);
    const assistantId = `${userMsg.id}-a`;
    appendMessage(tripId, { id: assistantId, role: 'assistant', content: '', tripId });

    try {
      await service.sendMessage(prompt, tripId, token => {
        updateLastAssistantMessage(tripId, m => ({ ...m, content: m.content + token }));
      });
    } catch (e) {
      updateLastAssistantMessage(tripId, m => ({ ...m, content: 'Sorry, something went wrong.' }));
    }
  };

  useEffect(() => {
    serviceRef.current?.flushQueue(token => {
      // We do not know tripId for queued messages here; flushing will re-trigger sendMessage.
      // ChatService handles re-sending and we append in sendMessage when called.
    });
  }, []);

  return (
    <ChatContext.Provider value={{ messagesByTrip, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export default ChatContext;
