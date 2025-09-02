import {
  fetchCheapestFlights,
  generateHotelLink,
  generatePoiLink,
  FlightOffer,
} from "@/utils/travelpayouts";
import {
  evaluatePolicy,
  PolicyEvaluationRequest,
} from "../packages/agent/policies";
import { logDecision } from "../packages/db/schemas/DecisionLog";

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
  {
    name: "confirm_booking",
    description: "Confirm a booking after evaluating policy guardrails",
    parameters: {
      type: "object",
      properties: {
        cost: { type: "number", description: "Cost of the booking" },
        departureTime: {
          type: "string",
          description: "ISO departure time, if applicable",
        },
        brand: { type: "string", description: "Airline or hotel brand" },
        tripTotal: {
          type: "number",
          description: "Current cumulative trip cost",
        },
      },
      required: ["cost"],
    },
  },
];

export type TravelFunctionName =
  | "search_flights"
  | "hotel_link"
  | "activity_link"
  | "confirm_booking";

export const executeAgentFunction = async (
  name: TravelFunctionName,
  args: any
): Promise<any> => {
  switch (name) {
    case "search_flights": {
      const { origin, destination, departDate } = args;
      const flights: FlightOffer[] = await fetchCheapestFlights(
        origin,
        destination,
        departDate
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
    case "confirm_booking": {
      const request: PolicyEvaluationRequest = {
        cost: args.cost,
        departureTime: args.departureTime,
        brand: args.brand,
        tripTotal: args.tripTotal,
      };
      const decision = evaluatePolicy(request);
      logDecision({
        id: Date.now().toString(),
        action: "confirm_booking",
        allowed: decision.allowed,
        rationale: decision.reason || "",
        timestamp: new Date(),
        payload: args,
      });
      if (decision.allowed) {
        return { status: "confirmed" };
      }
      return { status: "needs_confirmation", reason: decision.reason };
    }
    default:
      throw new Error(`Unknown function ${name}`);
  }
};
