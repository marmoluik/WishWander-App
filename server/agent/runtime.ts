// Minimal orchestrator placeholder using OpenAI function calling
import type { ChatMessage } from '../../src/shared/chat/types';

export async function runAgent(messages: ChatMessage[]): Promise<string> {
  // In a full implementation this would call the OpenAI API with function calling
  // and invoke domain specific tools. For now we just echo the last user message.
  const last = messages.reverse().find(m => m.role === 'user');
  return last ? `Agent: ${last.content}` : 'Agent ready';
}
