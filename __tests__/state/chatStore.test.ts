jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import { useChatStore } from "../../src/state/chatStore";

describe("chatStore", () => {
  beforeEach(() => {
    useChatStore.getState().clear();
  });

  it("adds and updates messages", () => {
    const { addMessage, updateMessage } = useChatStore.getState();
    addMessage("t1", { id: "1", role: "user", content: "hi" });
    updateMessage("t1", "1", "hello");
    expect(useChatStore.getState().threads["t1"].messages[0].content).toBe("hello");
  });
});
