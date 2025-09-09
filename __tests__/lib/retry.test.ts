import { retry } from "../../src/lib/retry";

describe("retry", () => {
  it("retries the provided function", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("ok");
    const result = await retry(fn, { retries: 3, minTimeout: 1, jitter: false });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
