jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import { useChatStore } from "../../src/state/chatStore";

describe("chatStore", () => {
  beforeEach(() => {
    useChatStore.getState().clear();
  });

  it("streams assistant messages", () => {
    const store = useChatStore.getState();
    const assistant = store.send("t1", "hello");
    store.receiveChunk("t1", assistant.id, "world");
    store.complete("t1", assistant.id);
    const msgs = useChatStore.getState().threads["t1"].messages;
    expect(msgs[1].content).toBe("world");
    expect(msgs[1].partial).toBe(false);
  });
});
