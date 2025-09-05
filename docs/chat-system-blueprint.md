# Chat System Blueprint

This document outlines the architecture for a cross‑platform chat system used by the WishWander autonomous travel assistant. The goal is to deliver consistent behaviour on web (Next.js) and mobile (Expo) with streaming responses, offline resilience, and a deterministic tool‑calling pipeline.

## Overview

The chat stack consists of three layers:

1. **ChatService** – handles network requests, streams model responses, and queues messages when offline.
2. **ChatContext** – React context that stores messages per trip and exposes a `sendMessage` API to UI components.
3. **UI Components** – platform‑specific screens/pages that render messages and capture user input.

```
UI (React / React Native)
   │
   ▼
ChatContext (state & streaming)
   │
   ▼
ChatService (network + offline queue)
```

## Streaming

`ChatService.sendMessage` accepts an optional callback invoked for every token. The current implementation splits the final response into whitespace‑delimited tokens, enabling progressive rendering. This can be replaced with a true server‑sent streaming API without changing the UI layer.

## Offline Queue

If a network request fails, the payload is stored in AsyncStorage under `offline-chat-queue`. The `flushQueue` method retries queued messages when connectivity returns. The `ChatProvider` calls `flushQueue` on mount to send any pending messages automatically.

## Trip Awareness

Messages are namespaced by `tripId`. The context keeps a `messagesByTrip` map so the UI can switch between trips without losing history.

## Error Handling

Failures during `sendMessage` update the placeholder assistant message with a generic error string. The queued message is preserved for retry.

## Testing

The architecture is intentionally framework‑agnostic, allowing Playwright (web) and Detox (mobile) to drive the UI while mocking network failures or streaming responses.

Future work includes integrating real server streaming, deterministic tool‑calling audits, and more sophisticated offline detection.
