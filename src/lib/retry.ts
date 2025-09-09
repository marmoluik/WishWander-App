export interface RetryOptions {
  retries?: number;
  factor?: number;
  minTimeout?: number;
  jitter?: boolean;
}

export async function retry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const { retries = 3, factor = 2, minTimeout = 500, jitter = true } = opts;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = minTimeout * Math.pow(factor, attempt - 1);
      const sleep = jitter ? delay * (0.5 + Math.random() / 2) : delay;
      await new Promise((res) => setTimeout(res, sleep));
    }
  }
}
