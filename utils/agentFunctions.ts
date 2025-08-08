import {
  fetchCheapestFlights,
  generateHotelLink,
  generatePoiLink,
  FlightOffer,
} from "@/utils/travelpayouts";
import { UserPreferences } from "@/types/user";

/**
 * Function declarations exposed to the LLM for structured function calling.
 * These are consumed by the Gemini SDK when starting a chat session.
 */
export const functionDeclarations = [
  {
    name: "search_flights",
    description: "Find cheapest flight offers between two IATA airport codes",
    parameters: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin airport IATA code" },
        destination: {
          type: "string",
          description: "Destination airport IATA code",
        },
        departDate: {
          type: "string",
          description: "Departure date in YYYY-MM-DD format",
        },
      },
      required: ["origin", "destination", "departDate"],
    },
  },
  {
    name: "hotel_link",
    description: "Create an affiliate booking link for hotels at a destination",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Destination name" },
        checkIn: { type: "string", description: "Check in date" },
        checkOut: { type: "string", description: "Check out date" },
      },
      required: ["query"],
    },
  },
  {
    name: "activity_link",
    description: "Create an affiliate booking link for activities or transfers",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Activity description, e.g. 'Lisbon walking tour'",
        },
      },
      required: ["query"],
    },
  },
];

export type TravelFunctionName =
  | "search_flights"
  | "hotel_link"
  | "activity_link";

export const executeAgentFunction = async (
  name: TravelFunctionName,
  args: any,
  prefs?: UserPreferences
): Promise<any> => {
  switch (name) {
    case "search_flights": {
      const { origin, destination, departDate } = args;
      const flights: FlightOffer[] = await fetchCheapestFlights(
        origin,
        destination,
        departDate,
        prefs
      );
      return flights;
    }
    case "hotel_link": {
      const { query, checkIn, checkOut } = args;
      return { url: generateHotelLink(query, checkIn, checkOut) };
    }
    case "activity_link": {
      const { query } = args;
      return { url: generatePoiLink(query) };
    }
    default:
      throw new Error(`Unknown function ${name}`);
  }
};
