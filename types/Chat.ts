export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
}
