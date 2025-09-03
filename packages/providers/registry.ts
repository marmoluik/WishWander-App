import {
  FlightSearchProvider,
  HotelSearchProvider,
  ActivitySearchProvider,
} from "./types";
import {
  DefaultFlightSearchProvider,
  DefaultHotelSearchProvider,
  DefaultActivitySearchProvider,
} from "./default";

const flightProviders: Record<string, FlightSearchProvider> = {
  default: new DefaultFlightSearchProvider(),
};

const hotelProviders: Record<string, HotelSearchProvider> = {
  default: new DefaultHotelSearchProvider(),
};

const activityProviders: Record<string, ActivitySearchProvider> = {
  default: new DefaultActivitySearchProvider(),
};

export const flightProvider: FlightSearchProvider =
  flightProviders[process.env.FLIGHTS_PROVIDER || "default"];

export const hotelProvider: HotelSearchProvider =
  hotelProviders[process.env.HOTELS_PROVIDER || "default"];

export const activityProvider: ActivitySearchProvider =
  activityProviders[process.env.ACTIVITIES_PROVIDER || "default"];

export const providers = {
  flights: flightProvider,
  hotels: hotelProvider,
  activities: activityProvider,
};
