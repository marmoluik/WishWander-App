import {
  generateFlightLink,
  fetchCheapestFlights,
  fetchFlightInfo,
  generateHotelLink,
  generatePoiLink,
} from "@/utils/travelpayouts";
import {
  FlightSearchProvider,
  FlightOffer,
  FlightInfo,
  HotelSearchProvider,
  HotelOffer,
  ActivitySearchProvider,
  ActivityOffer,
} from "./types";

/**
 * Default flight provider using Travelpayouts for deep links and mock data
 */
export class DefaultFlightSearchProvider implements FlightSearchProvider {
  async search({ origin, destination, departDate }: {
    origin: string;
    destination: string;
    departDate: string;
  }): Promise<FlightOffer[]> {
    try {
      const offers = await fetchCheapestFlights(origin, destination, departDate);
      if (offers.length) {
        return offers.map((o) => ({
          airline: o.airline,
          flightNumber: o.flightNumber,
          price: o.price,
          bookingUrl: o.bookingUrl,
          co2Kg: o.co2Kg,
        }));
      }
    } catch {
      // ignore and fall back to mock
    }
    return Array.from({ length: 10 }).map((_, i) => ({
      airline: "Demo Air",
      flightNumber: `DM${100 + i}`,
      price: 199 + i * 20,
      bookingUrl: generateFlightLink(origin, destination, departDate),
    }));
  }

  getSearchUrl({
    origin,
    destination,
    departDate,
    returnDate,
  }: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
  }): string {
    return generateFlightLink(origin, destination, departDate, returnDate);
  }

  async getInfo({
    origin,
    destination,
    departDate,
  }: {
    origin: string;
    destination: string;
    departDate: string;
  }): Promise<FlightInfo | null> {
    try {
      return await fetchFlightInfo(origin, destination, departDate);
    } catch {
      return null;
    }
  }
}

/**
 * Default hotel provider returning mock results with deep links
 */
export class DefaultHotelSearchProvider implements HotelSearchProvider {
  async search({ query, checkIn, checkOut }: {
    query: string;
    checkIn?: string;
    checkOut?: string;
  }): Promise<HotelOffer[]> {
    return [
      {
        name: `${query} Hotel`,
        price: 100,
        bookingUrl: generateHotelLink(query, checkIn, checkOut),
      },
    ];
  }

  getSearchUrl({
    query,
    checkIn,
    checkOut,
  }: {
    query: string;
    checkIn?: string;
    checkOut?: string;
  }): string {
    return generateHotelLink(query, checkIn, checkOut);
  }
}

/**
 * Default activities provider returning mock results with deep links
 */
export class DefaultActivitySearchProvider implements ActivitySearchProvider {
  async search({ query }: { query: string }): Promise<ActivityOffer[]> {
    return [
      {
        name: query,
        price: 50,
        bookingUrl: generatePoiLink(query),
      },
    ];
  }

  getSearchUrl({ query }: { query: string }): string {
    return generatePoiLink(query);
  }
}
