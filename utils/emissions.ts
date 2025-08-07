export const fetchFlightEmissions = async (
  origin: string,
  destination: string
): Promise<number | null> => {
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
          flights: [{ origin, destination }],
        }),
      }
    );
    const json = await res.json();
    const grams =
      json?.flights?.[0]?.emissionsGramsCO2e ??
      json?.flightEmissions?.[0]?.emissionsGramsCO2e;
    return typeof grams === "number" ? grams : null;
  } catch (e) {
    console.error("emissions fetch failed", e);
    return null;
  }
};
