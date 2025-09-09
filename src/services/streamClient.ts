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

export async function streamChat(
  req: ChatRequest,
  onToken: TokenCallback,
  opts: { signal?: AbortSignal } = {}
) {
  const { signal } = opts;
  let final = "";
  await retry(async () => {
    const controller = new AbortController();
    const composite = signal
      ? new AbortController()
      : controller; // use separate controller if no external signal
    if (signal) {
      signal.addEventListener("abort", () => composite.abort(), { once: true });
    }
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: composite.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    if (res.body) {
      for await (const msg of parseSSE(res.body)) {
        if (msg.event === "token") {
          final += msg.data;
          onToken(msg.data);
        }
      }
    } else {
      // Fallback to non-streaming request
      const text = await res.text();
      final += text;
      onToken(text);
    }
  });
  return final;
}
