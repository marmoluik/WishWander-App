// config/GeminiConfig.ts

import Constants from 'expo-constants';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Pull the key you injected via app.config.js → extra
const apiKey = Constants.expoConfig!.extra!.geminiApiKey as string;
if (!apiKey) {
  throw new Error(
    '🚨 Missing Generative AI API key in Constants.expoConfig.extra.geminiApiKey'
  );
}

// Create the Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Prepare your model & default generationConfig
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

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
  history: Array<{ role: 'user' | 'model'; parts: { text: string }[] }>
) {
  return model.startChat({
    generationConfig: defaultGenerationConfig,
    history,
  });
}
