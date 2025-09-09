export interface SSEMessage {
  event?: string;
  data: string;
}

export async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<SSEMessage> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split(/\n\n|\r\n\r\n/);
    buffer = parts.pop() ?? '';
    for (const part of parts) {
      const eventMatch = part.match(/^event: (.*)$/m);
      const dataMatch = part.match(/^data: ([\s\S]*)$/m);
      if (dataMatch) {
        yield { event: eventMatch?.[1], data: dataMatch[1].trimEnd() };
      }
    }
  }
  if (buffer) {
    const eventMatch = buffer.match(/^event: (.*)$/m);
    const dataMatch = buffer.match(/^data: ([\s\S]*)$/m);
    if (dataMatch) {
      yield { event: eventMatch?.[1], data: dataMatch[1].trimEnd() };
    }
  }
}
