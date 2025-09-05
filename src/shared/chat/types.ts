export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

export interface TravelerProfile {
  id: string;
  name: string;
  budget: number;
  preferences?: Record<string, unknown>;
}
