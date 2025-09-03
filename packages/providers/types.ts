export interface FlightInfo {
  airline: string;
  flightNumber: string;
  price: number | string;
}

export interface FlightOffer extends FlightInfo {
  bookingUrl: string;
  /** estimated CO2 emissions for the trip in kilograms */
  co2Kg?: number;
}

export interface FlightSearchProvider {
  search(params: {
    origin: string;
    destination: string;
    departDate: string;
  }): Promise<FlightOffer[]>;
  getSearchUrl(params: {
    origin: string;
    destination: string;
    departDate: string;
    returnDate?: string;
  }): string;
  getInfo?(params: {
    origin: string;
    destination: string;
    departDate: string;
  }): Promise<FlightInfo | null>;
}

export interface HotelOffer {
  name: string;
  price?: number | string;
  bookingUrl: string;
  imageUrl?: string;
}

export interface HotelSearchProvider {
  search(params: {
    query: string;
    checkIn?: string;
    checkOut?: string;
  }): Promise<HotelOffer[]>;
  getSearchUrl(params: {
    query: string;
    checkIn?: string;
    checkOut?: string;
  }): string;
}

export interface ActivityOffer {
  name: string;
  price?: number | string;
  bookingUrl: string;
  imageUrl?: string;
}

export interface ActivitySearchProvider {
  search(params: { query: string }): Promise<ActivityOffer[]>;
  getSearchUrl(params: { query: string }): string;
}
