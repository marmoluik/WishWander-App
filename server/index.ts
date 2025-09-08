// @ts-nocheck
import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// simple in-memory storage for demo purposes
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const conversations: Record<string, Message[]> = {};

const app = express();
app.use(express.json());

// enqueue user message and simulate LLM processing
app.post('/api/chat/:tripId/send', (req, res) => {
  const { tripId } = req.params;
  const { message } = req.body as { message?: string };
  if (!message) {
    return res.status(400).json({ error: 'message required' });
  }
  const convo = conversations[tripId] || (conversations[tripId] = []);
  convo.push({ role: 'user', content: message });

  // simulate LLM response
  setTimeout(() => {
    const reply = `Echo: ${message}`;
    convo.push({ role: 'assistant', content: reply });
    broadcast(tripId, reply);
  }, 250);

  res.json({ status: 'queued' });
});

// simple websocket handler for streaming assistant replies
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
const sockets: Record<string, Set<WebSocket>> = {};

server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url ?? '', 'http://localhost');
  if (url.pathname.startsWith('/api/chat/') && url.pathname.endsWith('/ws')) {
    const parts = url.pathname.split('/');
    const tripId = parts[3];
    wss.handleUpgrade(req, socket as any, head, (ws) => {
      const set = sockets[tripId] || (sockets[tripId] = new Set());
      set.add(ws);
      ws.on('close', () => set.delete(ws));
    });
  }
});

function broadcast(tripId: string, text: string) {
  const set = sockets[tripId];
  if (!set) return;
  for (const ws of set) {
    ws.send(JSON.stringify({ type: 'token', value: text }));
  }
}

// mock concierge checkout using Stripe
app.post('/api/concierge/checkout', (_req, res) => {
  if (!process.env.STRIPE_KEY) {
    return res.json({ url: 'https://example.com/mock-checkout' });
  }
  // real Stripe integration would go here
  res.json({ url: 'https://example.com/checkout' });
});

// mock Expo push notifications
app.post('/api/notify/push', (req, res) => {
  if (!process.env.EXPO_TOKEN) {
    console.log('Mock push notification:', req.body);
    return res.json({ mock: true });
  }
  // real Expo push notification would go here
  res.json({ sent: true });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`server listening on ${port}`);
});

export default server;
