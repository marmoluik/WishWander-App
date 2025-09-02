export interface ForecastHour {
  time: string; // ISO string
  precipitation: number; // probability 0-100
}

/**
 * Fetch hourly precipitation forecast for given coordinates and dates.
 * Dates can span multiple days; the API will return hourly slots between
 * the earliest and latest date in the array.
 */
export const getForecast = async (
  lat: number,
  lng: number,
  dates: Date[]
): Promise<ForecastHour[]> => {
  if (!dates.length) return [];
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const start = sorted[0].toISOString().slice(0, 10);
  const end = sorted[sorted.length - 1].toISOString().slice(0, 10);

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&hourly=precipitation_probability&start_date=${start}&end_date=${end}&timezone=UTC` +
      (apiKey ? `&apikey=${apiKey}` : "");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const hours: ForecastHour[] = [];
    const times: string[] = data.hourly?.time || [];
    const precip: number[] = data.hourly?.precipitation_probability || [];
    for (let i = 0; i < times.length; i++) {
      hours.push({ time: times[i], precipitation: precip[i] || 0 });
    }
    return hours;
  } catch (e) {
    console.error("weather forecast failed", e);
    return [];
  }
};
