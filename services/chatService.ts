import AsyncStorage from '@react-native-async-storage/async-storage';
import { runTravelAgent } from '@/utils/chatAgent';

export type StreamCallback = (token: string) => void;

interface QueuedMessage {
  prompt: string;
  tripId?: string;
}

/**
 * ChatService
 * Handles sending chat prompts with basic streaming support and offline queueing.
 */
export default class ChatService {
  private queueKey = 'offline-chat-queue';

  async sendMessage(prompt: string, tripId?: string, onToken?: StreamCallback): Promise<string> {
    try {
      const reply = await runTravelAgent(prompt, tripId);
      if (onToken) {
        for (const token of reply.split(/(\s+)/)) {
          onToken(token);
        }
      }
      return reply;
    } catch (e) {
      await this.enqueue({ prompt, tripId });
      throw e;
    }
  }

  private async enqueue(msg: QueuedMessage) {
    try {
      const existing = await AsyncStorage.getItem(this.queueKey);
      const arr: QueuedMessage[] = existing ? JSON.parse(existing) : [];
      arr.push(msg);
      await AsyncStorage.setItem(this.queueKey, JSON.stringify(arr));
    } catch {
      // ignore storage errors
    }
  }

  async flushQueue(onToken?: StreamCallback) {
    try {
      const existing = await AsyncStorage.getItem(this.queueKey);
      if (!existing) return;
      const arr: QueuedMessage[] = JSON.parse(existing);
      await AsyncStorage.removeItem(this.queueKey);
      for (const msg of arr) {
        await this.sendMessage(msg.prompt, msg.tripId, onToken);
      }
    } catch {
      // ignore
    }
  }
}
