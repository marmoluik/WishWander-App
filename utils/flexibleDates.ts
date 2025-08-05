import { format } from 'date-fns';

export interface FlexibleDateRange {
  startDate: string;
  endDate: string;
  price: number;
}

/**
 * Search for the cheapest date ranges between two airports within a duration window.
 * This uses the Kiwi.com API via RapidAPI if a key is available. When the key is
 * missing the function returns mocked prices so the rest of the app can be tested
 * without network access.
 */
export async function searchCheapestDateRanges(
  origin: string,
  destination: string,
  durationRange: [number, number]
): Promise<FlexibleDateRange[]> {
  const [minDays, maxDays] = durationRange;
  const rapidKey = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
  const rapidHost = 'kiwi-com-cheap-flights.p.rapidapi.com';
  const today = new Date();
  const results: FlexibleDateRange[] = [];

  // Search over the next 30 days for the best prices
  for (let offset = 0; offset < 30; offset++) {
    const start = new Date(today.getTime() + offset * 86400000);
    for (let len = minDays; len <= maxDays; len++) {
      const end = new Date(start.getTime() + len * 86400000);
      let price = Number.POSITIVE_INFINITY;

      if (rapidKey) {
        try {
          const dateFrom = format(start, 'dd/MM/yyyy');
          const returnFrom = format(end, 'dd/MM/yyyy');
          const res = await fetch(
            `https://${rapidHost}/v2/search?fly_from=${origin}&fly_to=${destination}&date_from=${dateFrom}&date_to=${dateFrom}&return_from=${returnFrom}&return_to=${returnFrom}&limit=1&sort=price`,
            {
              headers: {
                'X-RapidAPI-Key': rapidKey,
                'X-RapidAPI-Host': rapidHost,
              },
            }
          );
          const json = await res.json();
          const flight = json.data?.[0];
          if (flight) price = flight.price;
        } catch (e) {
          console.error('flexible date search failed', e);
        }
      }

      // Fallback random price when API isn't available
      if (!isFinite(price)) {
        price = Math.round(50 + Math.random() * 450);
      }

      results.push({
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        price,
      });
    }
  }

  results.sort((a, b) => a.price - b.price);
  return results.slice(0, 5);
}
