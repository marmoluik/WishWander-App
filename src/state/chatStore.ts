import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  partial?: boolean;
  createdAt: number;
}

export interface Thread {
  id: string;
  messages: Message[];
}

export interface ChatState {
  threads: Record<string, Thread>;
  send: (threadId: string, content: string) => Message;
  receiveChunk: (threadId: string, id: string, chunk: string) => void;
  complete: (threadId: string, id: string) => void;
  fail: (threadId: string, id: string, error: string) => void;
  clear: () => void;
}

const MAX_MESSAGES = 40;

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      threads: {},
      send: (threadId, content) => {
        const user: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          createdAt: Date.now(),
        };
        const assistant: Message = {
          id: `${user.id}-a`,
          role: 'assistant',
          content: '',
          partial: true,
          createdAt: Date.now(),
        };
        set((state) => {
          const thread = state.threads[threadId] || { id: threadId, messages: [] };
          const msgs = [...thread.messages, user, assistant].slice(-MAX_MESSAGES);
          return { threads: { ...state.threads, [threadId]: { id: threadId, messages: msgs } } };
        });
        return assistant;
      },
      receiveChunk: (threadId, id, chunk) =>
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;
          const idx = thread.messages.findIndex((m) => m.id === id);
          if (idx !== -1) {
            thread.messages[idx].content += chunk;
          }
          return { threads: { ...state.threads } };
        }),
      complete: (threadId, id) =>
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;
          const msg = thread.messages.find((m) => m.id === id);
          if (msg) msg.partial = false;
          return { threads: { ...state.threads } };
        }),
      fail: (threadId, id, error) =>
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;
          const msg = thread.messages.find((m) => m.id === id);
          if (msg) {
            msg.partial = false;
            msg.content = error;
          }
          return { threads: { ...state.threads } };
        }),
      clear: () => set({ threads: {} }),
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

