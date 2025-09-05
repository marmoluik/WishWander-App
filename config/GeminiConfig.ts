// config/GeminiConfig.ts

import Constants from 'expo-constants';
import { GoogleGenerativeAI, type Tool } from '@google/generative-ai';

// Pull the key injected via app.config.js → extra or env vars
const apiKey =
  Constants.expoConfig?.extra?.geminiApiKey ||
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY;

// Only initialise the client if a key is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Default generation config shared by all chat sessions
const defaultGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

/**
 * startChatSession
 * @param history Array of chat turns, each with role 'user' or 'model' and text parts.
 * @returns A running chat session instance.
 */
export function startChatSession(
  history: Array<{ role: 'user' | 'model'; parts: { text: string }[] }>,
  modelName: string = 'gemini-1.5-flash',
  tools?: Tool[],
  options?: { tripMode?: boolean; tripId?: string }
) {
  if (!genAI) {
    throw new Error(
      'Generative AI client not configured. Missing GEMINI_API_KEY environment variable.'
    );
  }
  const model = genAI.getGenerativeModel({ model: modelName, tools });
  const chatOptions: any = {
    generationConfig: defaultGenerationConfig,
    history,
  };
  if (options?.tripMode || options?.tripId) {
    chatOptions.context = {
      ...(options?.tripMode ? { tripMode: true } : {}),
      ...(options?.tripId ? { tripId: options.tripId } : {}),
    };
  }
  return model.startChat(chatOptions);
}
