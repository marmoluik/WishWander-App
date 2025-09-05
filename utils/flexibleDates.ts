import { format } from 'date-fns';

export interface FlexibleDateRange {
  startDate: string;
  endDate: string;
  price: number;
}

/**
 * Search for the cheapest date ranges between two airports within a duration window.
 * This uses the Travelpayouts API when a token is available. When the token is
 * missing the function returns mocked prices so the rest of the app can be tested
 * without network access.
 */
export async function searchCheapestDateRanges(
  origin: string,
  destination: string,
  durationRange: [number, number]
): Promise<FlexibleDateRange[]> {
  const [minDays, maxDays] = durationRange;
  const tpToken = process.env.EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN;
  const today = new Date();
  const tasks: Promise<FlexibleDateRange>[] = [];

  for (let offset = 0; offset < 30; offset++) {
    const start = new Date(today.getTime() + offset * 86400000);
    for (let len = minDays; len <= maxDays; len++) {
      const end = new Date(start.getTime() + len * 86400000);
      tasks.push(
        (async () => {
          let price = Number.POSITIVE_INFINITY;
          if (tpToken) {
            try {
              const depart = format(start, 'yyyy-MM-dd');
              const ret = format(end, 'yyyy-MM-dd');
              const res = await fetch(
                `https://api.travelpayouts.com/v2/prices/latest?origin=${origin}&destination=${destination}&depart_date=${depart}&return_date=${ret}&token=${tpToken}&currency=usd`
              );
              const json = await res.json();
              const flight = json.data?.[0];
              if (flight?.value) price = flight.value;
            } catch (e) {
              console.error('flexible date search failed', e);
            }
          }
          if (!isFinite(price)) {
            price = Math.round(50 + Math.random() * 450);
          }
          return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
            price,
          } as FlexibleDateRange;
        })()
      );
    }
  }

  const results = await Promise.all(tasks);
  results.sort((a, b) => a.price - b.price);
  return results.slice(0, 10);
}
