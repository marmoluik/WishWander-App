export interface WeatherResult {
  forecast: string;
  tempC: number;
}

export async function getWeather(location: string): Promise<WeatherResult> {
  if (process.env.USE_MOCK_PROVIDERS) {
    return { forecast: 'sunny', tempC: 25 };
  }
  // real weather provider integration would go here
  return { forecast: 'unknown', tempC: 0 };
}
