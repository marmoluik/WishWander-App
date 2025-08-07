const cache = new Map<string, number>();

export const fetchFlightEmissions = async (
  origin: string,
  destination: string,
  airline?: string,
  flightNumber?: string
): Promise<number | null> => {
  const key = `${origin}-${destination}-${airline ?? ""}-${flightNumber ?? ""}`;
  if (cache.has(key)) return cache.get(key)!;
  try {
    const apiKey = process.env.EXPO_PUBLIC_TRAVEL_IMPACT_API_KEY;
    if (!apiKey) return null;
    const res = await fetch(
      `https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flights: [
            {
              origin,
              destination,
              ...(airline ? { operatingCarrierCode: airline } : {}),
              ...(flightNumber ? { flightNumber } : {}),
            },
          ],
        }),
      }
    );
    const json = await res.json();
    const grams =
      json?.flights?.[0]?.emissionsGramsCO2e ??
      json?.flightEmissions?.[0]?.emissionsGramsCO2e;
    if (typeof grams === "number") {
      cache.set(key, grams);
      return grams;
    }
    return null;
  } catch (e) {
    console.error("emissions fetch failed", e);
    return null;
  }
};
