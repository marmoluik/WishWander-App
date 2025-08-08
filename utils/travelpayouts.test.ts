import {
  generateFlightLink,
  generateHotelLink,
  generatePoiLink,
  fetchFlightInfo,
} from "./travelpayouts";

describe("travelpayouts link generators", () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_TRAVELPAYOUTS_MARKER = "test";
  });

  it("generates flight link with params", () => {
    const url = generateFlightLink("NYC", "LON", "2025-12-01", "2025-12-10");
    const tp = new URL(url);
    expect(tp.hostname).toBe("tp.media");
    const marker = tp.searchParams.get("marker");
    expect(marker).toBe("test");
    const redirect = new URL(decodeURIComponent(tp.searchParams.get("u")!));
    expect(redirect.searchParams.get("origin")).toBe("NYC");
    expect(redirect.searchParams.get("destination")).toBe("LON");
    expect(redirect.searchParams.get("depart_date")).toBe("2025-12-01");
    expect(redirect.searchParams.get("return_date")).toBe("2025-12-10");
  });

  it("generates hotel link with params", () => {
    const url = generateHotelLink("New York", "2025-12-01", "2025-12-05");
    const tp = new URL(url);
    expect(tp.hostname).toBe("tp.media");
    const redirect = new URL(decodeURIComponent(tp.searchParams.get("u")!));
    expect(redirect.searchParams.get("destination")).toBe("New York");
    expect(redirect.searchParams.get("checkIn")).toBe("2025-12-01");
    expect(redirect.searchParams.get("checkOut")).toBe("2025-12-05");
  });

  it("generates poi link with query", () => {
    const cruise = generatePoiLink("Boat cruise");
    const tp = new URL(cruise);
    const redirect = new URL(decodeURIComponent(tp.searchParams.get("u")!));
    expect(redirect.href).toContain("searadar.com/search?q=Boat%20cruise");

    const tour = generatePoiLink("Lisbon tour");
    const tp2 = new URL(tour);
    const redirect2 = new URL(decodeURIComponent(tp2.searchParams.get("u")!));
    expect(redirect2.href).toContain("welcomepickups.com/search?q=Lisbon%20tour");
  });
});

describe("fetchFlightInfo scenarios", () => {
  const globalAny: any = global;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN = "token";
    globalAny.fetch = jest.fn();
  });

  it("returns null when flight cancelled (no data)", async () => {
    globalAny.fetch.mockResolvedValue({ json: async () => ({ data: [] }) });
    const info = await fetchFlightInfo("NYC", "LON", "2025-12-01");
    expect(info).toBeNull();
  });

  it("respects budget and returns null when over budget", async () => {
    globalAny.fetch.mockResolvedValue({
      json: async () => ({ data: [{ price: 500, airline: "AA", flight_number: "AA1" }] }),
    });
    const info = await fetchFlightInfo("NYC", "LON", "2025-12-01", {
      budget: 200,
      preferredAirlines: [],
      preferredHotels: [],
      dietaryNeeds: [],
      petFriendly: false,
    });
    expect(info).toBeNull();
  });
});
