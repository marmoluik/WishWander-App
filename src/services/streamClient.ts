import { retry } from "../lib/retry";
import { parseSSE } from "../lib/sse";

const BASE_URL = process.env.EXPO_PUBLIC_LLM_PROXY_URL;

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

export interface ChatRequest {
  threadId?: string;
  messages: ChatMessage[];
  locale?: string;
}

export type TokenCallback = (token: string) => void;

export async function streamChat(req: ChatRequest, onToken: TokenCallback, opts: { signal?: AbortSignal } = {}) {
  const { signal } = opts;
  await retry(async () => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal,
    });
    if (!res.ok || !res.body) {
      throw new Error(`HTTP ${res.status}`);
    }
    for await (const msg of parseSSE(res.body)) {
      if (msg.event === "token") {
        onToken(msg.data);
      }
    }
  });
}
