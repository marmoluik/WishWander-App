export interface Advisory {
  level: "low" | "medium" | "high";
  message: string;
}

const cache = new Map<string, Advisory>();

/** Fetch basic travel advisory for a destination country code. */
export const getAdvisories = async (
  destination: string
): Promise<Advisory> => {
  if (cache.has(destination)) return cache.get(destination)!;
  try {
    const res = await fetch(
      `https://www.travel-advisory.info/api?countrycode=${destination}`
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const adv = data?.data?.[destination]?.advisory;
    const score = adv?.score ?? 0;
    const level: Advisory["level"] =
      score >= 4 ? "high" : score >= 3 ? "medium" : "low";
    const result: Advisory = {
      level,
      message: adv?.message || "No advisory data available.",
    };
    cache.set(destination, result);
    return result;
  } catch (e) {
    console.error("advisory fetch failed", e);
    return { level: "low", message: "Verify local advisories." };
  }
};
