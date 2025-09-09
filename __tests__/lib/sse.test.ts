import { parseSSE } from "../../src/lib/sse";

function streamFromString(str: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(str));
      controller.close();
    },
  });
}

describe("parseSSE", () => {
  it("parses simple events", async () => {
    const stream = streamFromString("event: token\ndata: hello\n\n");
    const messages: any[] = [];
    for await (const msg of parseSSE(stream)) {
      messages.push(msg);
    }
    expect(messages).toEqual([{ event: "token", data: "hello" }]);
  });
});
