import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

export interface Thread {
  id: string;
  messages: Message[];
}

interface ChatState {
  threads: Record<string, Thread>;
  addMessage: (threadId: string, message: Message) => void;
  updateMessage: (threadId: string, id: string, content: string) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      threads: {},
      addMessage: (threadId, message) =>
        set((state) => {
          const thread = state.threads[threadId] || { id: threadId, messages: [] };
          thread.messages.push(message);
          return { threads: { ...state.threads, [threadId]: thread } };
        }),
      updateMessage: (threadId, id, content) =>
        set((state) => {
          const thread = state.threads[threadId];
          if (!thread) return state;
          const idx = thread.messages.findIndex((m) => m.id === id);
          if (idx !== -1) {
            thread.messages[idx] = { ...thread.messages[idx], content };
          }
          return { threads: { ...state.threads } };
        }),
      clear: () => set({ threads: {} }),
    }),
    {
      name: "chat-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
