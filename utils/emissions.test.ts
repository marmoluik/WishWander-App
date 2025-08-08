import { fetchFlightEmissions } from './emissions';

// Mock global fetch
const globalAny: any = global;

describe('fetchFlightEmissions', () => {
  beforeEach(() => {
    globalAny.fetch = jest.fn();
  });

  it('returns null when API key missing', async () => {
    delete process.env.EXPO_PUBLIC_TRAVEL_IMPACT_API_KEY;
    const grams = await fetchFlightEmissions('SFO', 'LAX');
    expect(grams).toBeNull();
    expect(globalAny.fetch).not.toHaveBeenCalled();
  });

  it('fetches and caches emissions data', async () => {
    process.env.EXPO_PUBLIC_TRAVEL_IMPACT_API_KEY = 'test';
    globalAny.fetch.mockResolvedValue({
      json: async () => ({
        flightEmissions: [{ emissionsGramsCO2e: 123 }],
      }),
    });
    const first = await fetchFlightEmissions('SFO', 'LAX');
    expect(first).toBe(123);
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);
    const second = await fetchFlightEmissions('SFO', 'LAX');
    expect(second).toBe(123);
    // second call should use cache
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);
  });
});
