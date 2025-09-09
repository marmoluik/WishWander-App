import React, { createContext, useContext, useEffect, useRef } from 'react';
import ChatService from '@/services/chatService';
import { useChatStore, ChatState } from '@/src/state/chatStore';

interface ChatContextValue {
  threads: ChatState['threads'];
  sendMessage: (prompt: string, threadId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const serviceRef = useRef<ChatService | null>(null);
  const store = useChatStore();

  if (!serviceRef.current) {
    serviceRef.current = new ChatService();
  }

  const sendMessage = async (prompt: string, threadId: string) => {
    const assistant = store.send(threadId, prompt);
    try {
      await serviceRef.current!.sendMessage(prompt, threadId, (token) =>
        store.receiveChunk(threadId, assistant.id, token)
      );
      store.complete(threadId, assistant.id);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Sorry, something went wrong.';
      store.fail(threadId, assistant.id, message);
    }
  };

  useEffect(() => {
    serviceRef.current?.flushQueue();
  }, []);

  return (
    <ChatContext.Provider value={{ threads: store.threads, sendMessage }}>
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
